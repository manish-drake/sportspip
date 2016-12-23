import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { File } from 'ionic-native';
import { Logger } from '../logging/logger';

declare var navigator: any;
declare var cordova: any;
import 'rxjs/Rx';

@Injectable()
export class ModelFactory {

    constructor(private _logger: Logger) { }

    CreateThumbnail(name, thumbname) {
        this._logger.Debug('Create thumbnail..');
        try {
            var blob: any;
            var sourcePath = cordova.file.externalRootDirectory + "SportsPIP/Video/" + name;
            navigator.createThumbnail(sourcePath, function (err, imageData) {
                blob = imageData;
            });
            Observable.interval(1000)
                .take(1).map((x) => x + 5)
                .subscribe((x) => {
                    var data = this.b64toBlob(blob, 'image/jpeg', 1024);
                    File.createFile(cordova.file.applicationStorageDirectory, thumbname + ".jpg", true).then(() => {
                        File.writeFile(cordova.file.applicationStorageDirectory, thumbname + ".jpg", data, true).then(() => {
                            console.log("thumbanil created ")
                        })
                    })
                })
             }
        catch (err) {
            this._logger.Error('Error,creating thumbnail: ', err);
        }
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        this._logger.Debug('Parse b64 to Blob..');
        try {
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
        catch (err) {
            this._logger.Error('Error,parsing b64 to blob: ', err);
        }
    }

}