import { Injectable, EventEmitter } from '@angular/core';
import { Core } from '../core';
import { Logger } from '../../logging/logger';
import { StrapiService } from '../../Services/strapi.service';
import { Storage } from '../../Services/Factory/Storage';
import { Package } from '../../Services/Package';


@Injectable()
export class Upload {

    dataDirectory: any;

    constructor(private core: Core,
        private _logger: Logger,
        private apiService: StrapiService,
        private storage: Storage,
        private packages: Package) {
        this.storage.externalDataDirectory().then((res) => {
            this.dataDirectory = res;
        });
    }

    Run(matrix, status: EventEmitter<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            var item = { 'metadata': matrix }
            this.apiService.addItem('pips', item)
                .subscribe((res) => {
                    if (res) {
                        console.log("PIP item posted to server: " + JSON.stringify(res))
                        let body = res.json();
                        let refId: string = body['id'];
                        if (refId) {
                            this.UploadMedia(matrix, refId, status)
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error) => {
                                    this.apiService.deleteItem('pips', refId).subscribe((res) => {
                                        console.log("Success removing failed pip item")
                                        return reject(error);
                                    }, (err) => {
                                        console.log("Error removing failed pip item: " + JSON.stringify(err))
                                        return reject(error);
                                    })
                                })
                        }
                        else{
                            return reject();
                        }
                    }
                }, (err) => {
                    return reject(err);
                });

        });
    }

    UploadMedia(matrix: any, refId: any, status: EventEmitter<any>) {
        return new Promise((resolve, reject) => {
            status.emit("creating package");
            this.packages.CreatePackage('Local', matrix.Name).then((res) => {
                console.log("Package created successfully");
                this.UploadThumbnail(matrix.ThumbnailSource, refId)
                    .then(() => {
                        status.emit("uploading package");
                        this.UploadPackage(matrix.Name, refId)
                            .then(() => {
                                return resolve();
                            })
                            .catch(() => {
                                return reject();
                            });
                    }).catch(() => {
                        return reject();
                    });
            }).catch((error) => {
                    console.log("Error creating Package: " + JSON.stringify(error));
                    return reject(error);
                })
        });
    }

    UploadThumbnail(fileName: string, refId: string) {
        console.log("Initializing thumbnail upload for pip id: " + refId)
        return new Promise((resolve, reject) => {
            this.UploadFile(this.dataDirectory, fileName + ".jpg", refId, 'thumbnail')
                .then((res) => {
                    console.log("Success uploading thumbnail: " + JSON.stringify(res))
                    return resolve();
                })
                .catch((error) => {
                    this._logger.Error('Error uploading thumbnail: ' + JSON.stringify(error));
                    return reject();
                });
        });
    }

    UploadPackage(fileName: string, refId: string) {
        var tempPath = this.dataDirectory + "Temp/";
        return new Promise((resolve, reject) => {
            console.log("Initializing package upload for pip id: " + refId)
            this.UploadFile(tempPath, fileName + ".sar", refId, 'package')
                .then((res) => {
                    console.log("Success uploading package: " + JSON.stringify(res))
                    return resolve();
                })
                .catch((error) => {
                    this._logger.Error('Error uploading package: ' + JSON.stringify(error));
                    return reject();
                });
        });
    }

    UploadFile(path: any, fileName: any, refId: any, field): Promise<any> {
        console.log("Uploading file: " + path + fileName);
        return new Promise((resolve, reject) => {
            var params = {};
	        params['refId'] = refId;
            params['ref'] = 'pips';
            params['field'] = field;
            this.apiService.uploadFile(path, fileName, params)
            .then((res) => {
                return resolve(res);
            })
            .catch((error) => {
                return reject(error);
            });
        });
    }

}