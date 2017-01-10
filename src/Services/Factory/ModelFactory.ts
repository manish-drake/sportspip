import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { VideoEditor, CreateThumbnailOptions } from 'ionic-native';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../Factory/StorageFactory';
import { Storage } from '../Factory/Storage';
import { Logger } from '../../logging/logger';
import { View } from '../../Matrix/view';

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
        this.platform.ready().then(() => {
            this.storageDataDir = this.storage.externalDataDirectory();
            this.rootDir = this.storage.externalRootDirectory();
        });
    }

    CreateThumbnail(name, thumbname) {
        this._logger.Debug('Create thumbnail..');

        var blob: any;
        var sourcePath = this.rootDir + "SportsPIP/Video/" + name;

        // var _createThumbnailOptions: CreateThumbnailOptions = { fileUri: sourcePath, outputFileName: thumbname };
        // VideoEditor.createThumbnail(_createThumbnailOptions)
        //     .then(res => {
        //         alert("Created: " + JSON.stringify(res));

        //         var path = res.substr(0, res.lastIndexOf('/') + 1);
        //         var fileName = res.substr(res.lastIndexOf('/') + 1);
        //         var slicedName = fileName.substr(-4);

        //         alert(path + "  " + fileName + " " + slicedName + " " + thumbname);

        //         this.storageFactory.MoveFile(path, this.storageDataDir, slicedName + ".jpg")
        //             .catch((err) => new Observable(err => { alert("Move error: " + JSON.stringify(err)) }))
        //             .subscribe(res => { alert("Moved: " + JSON.stringify(res)) })



        //         this.storageFactory.GetLisOfDirectory(this.rootDir + "SportsPIP/", "Video")
        //             .then(res => { alert(JSON.stringify(res)) })
        //             .catch(err => { alert("Error3: " + err) })
        //     })
        //     .catch(err => {
        //         alert("Error: " + JSON.stringify(err))
        //     })



        navigator.createThumbnail(sourcePath, function (err, imageData) {
            if (err != null) { this._logger.Error('Error,creating thumbnail: ', err); }
            else { blob = imageData; }
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


    CreateVideoView(fileName, selectedViewIndex, source) {
        var localView = {
            "Content": {
                "Capture": {
                    "Marker": {
                        "Marker.Objects": "",
                        "_name": "c379224ff2704c5ea5ad1f10275a28c1"
                    },
                    "View.ChronoMarker": "",
                    "_name": "ba160173f284474c9412192dcd77cb1c",
                    "_Kernel": fileName,
                    "_Title": "View " + (selectedViewIndex + 1),
                    "_Name": "ba160173f284474c9412192dcd77cb1c",
                    "_IsActive": "False"
                }
            },
            "_name": "View " + (selectedViewIndex + 1),
            "_Title": "View " + (selectedViewIndex + 1),
            "_Source": source
        }
        return localView;
    }

    ComposeNewView(value) {
        var view = new View();
        view._name = "View " + value;
        view._Title = "View " + value;
        view._Source = "(Blank)";
        view.Content=null;
        return view;

    }

    ComposeNewMatrix() {
        this._logger.Debug('Composing new matrix..');
        var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        let data =
            {
                "Matrix": {
                    "_name": name,
                    "_Name": name,
                    "_Title": "Title1",
                    "_Skill": "Serve",
                    "_Location": "Field",
                    "_Duration": "00:00:00",
                    "_DateCreated": name,
                    "_Sport": "Tennis",
                    "_Channel": "Local",
                    "Matrix.Children": {
                        "View":
                        {
                            "_name": "View 1",
                            "_Title": "View 1",
                            "_Source": "(Blank)",
                            "Content": {}
                        }
                    }
                }
            };
        return data;
    }

    ComposeMatrixHeader(fromMatrix) {
        this._logger.Debug('composing matrix header..');
        var header = {
            Title: fromMatrix._Title,
            DateCreated: fromMatrix._DateCreated,
            Name: fromMatrix._Name,
            Channel: fromMatrix._Channel,
            ThumbnailSource: "thumbnail",
            Sport: fromMatrix._Sport,
            Skill: fromMatrix._Skill,
            UploadID: "0",
            Duration: fromMatrix._Duration,
            Views: fromMatrix["Matrix.Children"].View.length
        };
        return header;
    }

    ComposeNewMatrixHeader(fromMatrix) {
        this._logger.Debug('composing new matrix header..');
        var header = {
            Title: fromMatrix._Title,
            DateCreated: fromMatrix._DateCreated,
            Name: fromMatrix._Name,
            Channel: fromMatrix._Channel,
            ThumbnailSource: "thumbnail",
            Sport: fromMatrix._Sport,
            Skill: fromMatrix._Skill,
            UploadID: "0",
            Duration: fromMatrix._Duration,
            Views: "1"
        };
        return header;
    }

    ComposeHeader(header) {
        var hea = {
            Title: header.Title,
            DateCreated: header.DateCreated,
            Name: header.Name,
            Channel: header.Channel,
            ThumbnailSource: header.ThumbnailSource,
            Sport: header.Sport,
            Skill: header.Skill,
            UploadID: header.UploadID,
            Duration: header.Duration,
            Views: header.Views
        };
        return hea;
    }


}