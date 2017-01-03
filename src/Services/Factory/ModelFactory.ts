import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { StorageFactory } from '../Factory/StorageFactory';
import { Storage } from '../Factory/Storage';
import { Logger } from '../../logging/logger';

declare var navigator: any;
import 'rxjs/Rx';

@Injectable()
export class ModelFactory {

    private storageDataDir: string;
    private rootDir: string;

    constructor(private _logger: Logger,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private platform: Platform) {
        if (this.platform.is('cordova')) {
            this.storageDataDir = this.storage.externalDataDirectory();
            this.rootDir = this.storage.externalRootDirectory();
        }
    }

    CreateThumbnail(name, thumbname) {
        this._logger.Debug('Create thumbnail..');

        var blob: any;
        var sourcePath = this.rootDir + "SportsPIP/Video/" + name;
        navigator.createThumbnail(sourcePath, function (err, imageData) {
            if (err != null) { this._logger.Error('Error,creating thumbnail: ', err); }
            else { blob = imageData;  }
        });
        Observable.interval(1000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
                var data = this.b64toBlob(blob, 'image/jpeg', 1024);
                this.storageFactory.CreateFile(this.storageDataDir, thumbname + ".jpg")
                    .then(() => {
                        this.storageFactory.WriteFile(this.storageDataDir, thumbname + ".jpg", data)
                            .then(() => {
                                this._logger.Debug("thumbanil created successfully..");
                            })
                    })
            })

    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

}