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
        var item = { 'metadata': matrix }
        return new Promise((resolve, reject) => {
            this.packages.CreatePackage('Local', matrix.Name).then((res) => {
                // console.log("Package created successfully");
                // var tempPath = this.dataDirectory + "Temp/";
                // this.UploadFile(tempPath, matrix.Name + ".zip", "", "")
                // .catch(err => {
                //     this._logger.Error('Uploading sar Error:', err);
                // })
                // .then((res: Response) => {
                //     console.log("Uploading sar success: " + res.text())
                // });
            })
            .catch((error) => {
                console.log("Error creating Package: " + JSON.stringify(error));
            })

            // return this.apiService.addItem('pipsoo', item)
            //     .subscribe((res: Response) => {
            //         if (res) {
            //             let body = res.json();
            //             let refId: string = body['id'];
            //             if (refId) {
            //                 // this.UploadMedia(matrix, refId);
            //             }
            //             return resolve(res)
            //         }
            //     }, (err) => {
            //         return reject(err);
            //     });
        });
    }

    UploadMedia(matrix: any, refId: any){
        this.UploadThumbnail(matrix.ThumbnailSource, refId);

        

        // this.UploadPackage("", refId);
    }

    UploadThumbnail(fileName: string, refId: string) {
        console.log("Initializing thumbnail upload for pip id: " + refId)
        this.UploadFile(this.dataDirectory, fileName + ".jpg", refId, 'thumbnail')
            .catch(err => {
                this._logger.Error('Uploading thumbnail; Error:', err);
            })
            .then((res: Response) => {
                console.log("Uploading thumbnail; success: " + res.text())
            });
    }

    UploadPackage(fileName: string, refId: string) {
        console.log("Initializing package upload for pip id: " + refId)
        this.UploadFile("", fileName + ".sar", refId, 'package')
            .catch(err => {
                this._logger.Error('Uploading package; Error:', err);
            })
            .then((res: Response) => {
                console.log("Uploading package; success: " + res.text())
            });
    }

    UploadFile(path: any, fileName: any, refId: any, field): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.storageFactory.ReadFileBufferAync(path, fileName)
                .subscribe((data) => {
                    const blob = new Blob([data]);
                    const formData = new FormData();
                    formData.append('files', blob, fileName)
                    // formData.append('refId', refId);
                    // formData.append('ref', 'pips');
                    // formData.append('field', field);
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