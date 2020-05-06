import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../Factory/StorageFactory';
import { SettingsService } from '../../Services/SettingsService';
import { Storage } from '../Factory/Storage';
import { Logger } from '../../logging/logger';
import 'rxjs/Rx';
import X2JS from 'x2js';

@Injectable()
export class ModelFactory {

    private storageDataDir: string;
    private rootDir: string;

    constructor(
        private _logger: Logger,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private platform: Platform,
        private videoEditor: VideoEditor) {
        this.storage.externalDataDirectory().then((edd) => {
            this.storageDataDir = edd;
            this.storage.externalRootDirectory().then((erd) => {
                this.rootDir = erd
            });
        });
    }

    CreateThumbnail(name, thumbname) {
        var sourcePath = this.rootDir + "SportsPIP/Video/" + name;
        var _createThumbnailOptions: CreateThumbnailOptions = { fileUri: sourcePath, outputFileName: thumbname, width: 400, height: 300, quality: 75 };
        this.videoEditor.createThumbnail(_createThumbnailOptions)
            .then(res => {
                this._logger.Debug("Thumbnail created in: " + res);
                var path = res.substr(0, res.lastIndexOf('/') + 1);
                var fileName = res.substr(res.lastIndexOf('/') + 1);
                this.storageFactory.MoveFile("file:///" + path, fileName, this.storageDataDir, thumbname + ".jpg")
                    .catch((err) => new Observable(err => {
                        this._logger.Error("Error getting Thumbnail from cache: " + JSON.stringify(err));
                    }))
                    .subscribe(res => {
                        this._logger.Debug("Got thumbnail: " + res)
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
        var uniqueId = SettingsService.uniqueId;
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
                "_UniqueID": uniqueId,
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
            UniqueID: fromMatrix._UniqueID,
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
            UniqueID: fromMatrix._UniqueID,
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
            UniqueID: header.UniqueID,
            ThumbnailSource: header.ThumbnailSource,
            Sport: header.Sport,
            Skill: header.Skill,
            UploadID: header.UploadID,
            Duration: header.Duration,
            Views: header.Views
        };
        return hea;
    }

    createMatrixforServer(fileName, duration, source) {
        var name = Date.now().toString();
        var uniqueID = SettingsService.uniqueId;
        let data =
        {
            "Matrix": {
                "_Name": fileName,
                "_Title": "Title1",
                "_Sport": "Tennis",
                "_Skill": "Serve",
                "_PIN": " ",
                "_UniqueID": uniqueID,
                "_DateModified": name,
                "_Duration": duration,
                "_Location": "Field",
                "_HasTransferred": false,
                "_Source": source,
                "Clips": {
                    "Clip": []
                }
            }
        };
        return data;
    }

    ComposePackageHeader(matrixFileName, files: any[]) {
        let data = {
            "PackageHeader": {
                "MtxFileName": matrixFileName,
                "Kernel": {
                    "string": files
                }
            }
        };
        let parser: any = new X2JS();
        var xmlData = parser.js2xml(data);
        return xmlData;
    }

}