import { Injectable } from '@angular/core';
import { Core } from '../core';
import { Logger } from '../../logging/logger';
import { Platform } from 'ionic-angular';
import { StrapiService } from '../../Services/strapi.service';
import { Storage } from '../../Services/Factory/Storage';
import { StorageFactory } from '../Factory/StorageFactory';
import { Response } from '@angular/http';
import { Package } from '../../Services/Package';


@Injectable()
export class Upload {

    dataDirectory: any;

    constructor(private core: Core,
        private _logger: Logger,
        private platform: Platform,
        private apiService: StrapiService,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private packages: Package) {
        this.storage.externalDataDirectory().then((res) => {
            this.dataDirectory = res;
        });
    }

    Run(matrix): Promise<any> {
        return new Promise((resolve, reject) => {
            // this.packages.CreatePackage('Local', matrix.Name).then((res) => {
            //     console.log("Package created successfully");
            //     var tempPath = this.dataDirectory + "Temp/";
            //     this.UploadFile(tempPath, matrix.Name + ".zip", "", "")
            //     .catch(err => {
            //         this._logger.Error('Uploading sar Error:', err);
            //         return reject("errr")
            //     })
            //     .then((res: Response) => {
            //         console.log("Uploading sar success: " + res.text())
            //         return resolve()
            //     });
            // })
            // .catch((error) => {
            //     console.log("Error creating Package: " + JSON.stringify(error));
            //     return reject("failed")
            // })

            var item = { 'metadata': matrix }
            this.apiService.addItem('pips', item)
                .subscribe((res: Response) => {
                    if (res) {
                        console.log("PIP item posted to server: " + JSON.stringify(res))
                        let body = res.json();
                        let refId: string = body['id'];
                        if (refId) {
                            this.UploadMedia(matrix, refId)
                                .then(() => {
                                    return resolve();
                                })
                                .catch((error) => {
                                    return reject(error);
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

    UploadMedia(matrix: any, refId: any) {
        return new Promise((resolve, reject) => {
            this.packages.CreatePackage('Local', matrix.Name).then((res) => {
                console.log("Package created successfully");
                this.UploadThumbnail(matrix.ThumbnailSource, refId)
                    .then(() => {
                        this.UploadPackage(matrix.Name, refId)
                            .then(() => {
                                return resolve();
                            })
                            .catch(() => {
                                return reject();
                            })
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
                .then((res: Response) => {
                    console.log("Uploading thumbnail; success: " + res.text())
                    return resolve();
                })
                .catch(err => {
                    this._logger.Error('Uploading thumbnail; Error:', err);
                    return reject();
                });
        });
    }

    UploadPackage(fileName: string, refId: string) {
        var tempPath = this.dataDirectory + "Temp/";
        return new Promise((resolve, reject) => {
            console.log("Initializing package upload for pip id: " + refId)
            this.UploadFile(tempPath, fileName + ".sar", refId, 'package')
                .then((res: Response) => {
                    console.log("Uploading package; success: " + res.text())
                    return resolve();
                })
                .catch(err => {
                    this._logger.Error('Uploading package; Error:', err);
                    return reject();
                });
        });
    }

    UploadFile(path: any, fileName: any, refId: any, field): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storageFactory.ReadFileBufferAync(path, fileName)
                .subscribe((data) => {
                    const blob = new Blob([data]);
                    const formData = new FormData();
                    formData.append('files', blob, fileName)
                    formData.append('refId', refId);
                    formData.append('ref', 'pips');
                    formData.append('field', field);
                    console.log("Posting file to server..")
                    this.apiService.uploadFile(formData)
                        .subscribe((res) => { return resolve(res); }
                            , (err) => { return reject(err); })

                }, (err) => {
                    return reject(err);
                })
        });
    }

}