import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../Factory/StorageFactory';
import { Logger } from '../logging/logger';

declare var navigator: any;
declare var cordova: any;
import 'rxjs/Rx';

@Injectable()
export class ModelFactory {

    constructor(private _logger: Logger, private storageFactory: StorageFactory) { }

    CreateThumbnail(name, thumbname) {
        this._logger.Debug('Create thumbnail..');

        var blob: any;
        var sourcePath = cordova.file.externalRootDirectory + "SportsPIP/Video/" + name;
        navigator.createThumbnail(sourcePath, function (err, imageData) {
            blob = imageData;
            if (err != null) { this._logger.Error('Error,creating thumbnail: ', err); }
        });
        Observable.interval(1000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
                var data = this.b64toBlob(blob, 'image/jpeg', 1024);
                this.storageFactory.CreateFile(cordova.file.applicationStorageDirectory, thumbname + ".jpg")
                .then(() => {
                    this.storageFactory.WriteFile(cordova.file.applicationStorageDirectory, thumbname + ".jpg", data)
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