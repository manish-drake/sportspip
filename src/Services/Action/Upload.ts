import { Injectable } from '@angular/core';
import { Core } from '../core';
import { Logger } from '../../logging/logger';
import { Platform } from 'ionic-angular';
import { StrapiService } from '../../Services/strapi.service';
import { Storage } from '../../Services/Factory/Storage';
import { StorageFactory } from '../Factory/StorageFactory';
import { Response } from '@angular/http';


@Injectable()
export class Upload {

    dataDirectory: any;

    constructor(private core: Core,
        private _logger: Logger,
        private platform: Platform,
        private apiService: StrapiService,
        private storage: Storage,
        private storageFactory: StorageFactory) {
        this.storage.externalDataDirectory().then((res) => {
            this.dataDirectory = res;
        });
    }

    Run(matrix): Promise<any> {
        var item = { 'metadata': matrix }
        return new Promise((resolve, reject) => {
            return this.apiService.addItem('pips', item)
                .subscribe((res: Response) => {
                    if (res) {
                        let body = res.json();
                        let refId: string = body['id'];
                        if (refId) {
                            this.UploadThumbnail(matrix.ThumbnailSource, refId);
                            this.UploadPackage(matrix.ThumbnailSource, refId);
                        }
                        return resolve(res)
                    }
                }, (err) => {
                    return reject(err);
                })
        })
    }

    UploadThumbnail(fileName: string, refId: string) {
        console.log("Initializing thumbnail upload for pip id: " + refId)
        this.UploadFile(fileName + ".jpg", refId, 'thumbnail')
            .catch(err => {
                this._logger.Error('Uploading thumbnail; Error:', err);
            })
            .then((res: Response) => {
                console.log("Uploading thumbnail; success: " + res.text())
            });
    }

    UploadPackage(fileName: string, refId: string) {
        console.log("Initializing package upload for pip id: " + refId)
        this.UploadFile(fileName + ".sar", refId, 'package')
            .catch(err => {
                this._logger.Error('Uploading package; Error:', err);
            })
            .then((res: Response) => {
                console.log("Uploading package; success: " + res.text())
            });
    }

    UploadFile(fileName: any, refId: any, field): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.storageFactory.ReadFileBufferAync(this.dataDirectory, fileName)
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