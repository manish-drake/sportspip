import { Injectable } from '@angular/core';
import { Core } from '../core';
import { Logger } from '../../logging/logger';
import { Platform } from 'ionic-angular';
import { StrapiService } from '../../Services/strapi.service';
import { Storage } from '../../Services/Factory/Storage';
import { StorageFactory } from '../Factory/StorageFactory';
import { Observable } from 'rxjs/Rx';
import { JsonPipe } from '@angular/common';
import { File, FileEntry } from '@ionic-native/file'


@Injectable()
export class Upload {

    dataDirectory: any;

    constructor(private core: Core,
        private _logger: Logger,
        private platform: Platform,
        private apiService: StrapiService,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private file: File) {
        this.storage.externalDataDirectory().then((res) => {
            this.dataDirectory = res;
        });
    }

    Run(matrix): Promise<any> {
        var item = { 'name': matrix.name, 'metadata': matrix }
        return new Promise((resolve, reject) => {
            return this.apiService.addItem('pips', item)
                .subscribe((res) => {
                    if (res) {
                        this.UploadThumbnail(matrix.ThumbnailSource, res['id'])
                        return resolve(res)
                    }
                }, (err) => {
                    return reject(err);
                })
        })
    }

    UploadThumbnail(fileName: string, refId: string) {
        this.storageFactory.ReadFileDataAync(this.dataDirectory, fileName + ".jpg")
            .subscribe((data) => {
                this.file.resolveLocalFilesystemUrl(this.dataDirectory + fileName + ".jpg")
                    .then(entry => {
                        console.log(":: success; resolveLocalFilesystemUrl: " + JSON.stringify(entry));
                        (entry as FileEntry).file(file => {
                            this.uploadFile(file, fileName, refId)
                        })
                    })
                    .catch(err => {
                        alert(':: Error while reading file.');
                    });
            }, (err) => {
                console.log(":: err: " + JSON.stringify(err))
            })
    }

    uploadFile(file: any, fileName: any, refId: any): any {
        console.log(":: file: " + JSON.stringify(file))
        const reader = new FileReader();
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type });
            const formData = new FormData();
            formData.append('files', blob)
            formData.append('refId', refId);
            formData.append('ref', 'pips');
            formData.append('field', 'Thumbnail');
            this.apiService.uploadFile(formData)
                .subscribe((res) => {
                    console.log(":: Success: Thumbnail uploaded; res: " + res)
                }, (err) => {
                    console.log(":: Error uploading Thumbnail: " + err)
                })
        };
        reader.readAsDataURL(file);
    }
}