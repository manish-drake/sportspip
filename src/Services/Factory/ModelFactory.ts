import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { VideoEditor, CreateThumbnailOptions } from 'ionic-native';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../Factory/StorageFactory';
import { Storage } from '../Factory/Storage';
import { Logger } from '../../logging/logger';

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
        var sourcePath = this.rootDir + "SportsPIP/Video/" + name;
        var _createThumbnailOptions: CreateThumbnailOptions = { fileUri: sourcePath, outputFileName: thumbname };
        VideoEditor.createThumbnail(_createThumbnailOptions)
            .then(res => {
                this._logger.Debug("Thumbnail created in:" + res);
                var path = res.substr(0, res.lastIndexOf('/') + 1);
                var fileName = res.substr(res.lastIndexOf('/') + 1);
                this.storageFactory.MoveFile("file:///" + path, fileName, this.storageDataDir, thumbname + ".jpg")
                    .catch((err) => new Observable(err => {
                        this._logger.Error("Error getting Thumbnail from cache: " + JSON.stringify(err));
                    }))
                    .subscribe(res => {
                        this._logger.Debug("Got thumbnail")
                    })
            })
            .catch(err => {
                this._logger.Error("Error creating thumbnail: " + JSON.stringify(err))
            })
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
        var view = {
            "Content": {},
            "_name": "View " + value,
            "_Title": "View " + value,
            "_Source": "(Blank)"
        }
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