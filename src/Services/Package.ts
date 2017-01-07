import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { StorageFactory } from './Factory/StorageFactory';
import { Core } from './core';
import { Storage } from './Factory/Storage';
import { Http } from '@angular/http';
import { DirectoryEntry } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import X2JS from 'x2js';

declare var zip: any;
declare var FileTransfer: any;
declare var navigator: any;


@Injectable()
export class Package {

    private storageDataDir: string;
    private storageRootDirectory: string;
    constructor(private http: Http,
        private storage: Storage,
        private core: Core,
        private platform: Platform,
        private storagefactory: StorageFactory) {
        platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this.storageDataDir = this.storage.externalDataDirectory();
                this.storageRootDirectory = this.storage.externalRootDirectory();
            }
        });
    }

    public fileName: any;
    public channelName: any;

    MoveToLocalCollection(channelName) {
        this.fileName = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        this.platform.ready().then(() => {
            this.storagefactory.ReadFileAync(this.storageDataDir + "Temp/matrix1", "Header.xml").then((result => {
                console.log("header moving..");
                var header = JSON.parse(result.toString());
                header.Name = this.fileName;
                header.DateCreated = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
                header.ThumbnailSource = header.UploadID;
                this.channelName = header.Channel;
                this.core.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices").then((res) => {
                    console.log("header moved");
                });

            }));
            return this.storagefactory.GetLisOfDirectory(this.storageDataDir + "Temp/", "matrix1").then((success) => {
                success.forEach(file => {
                    var sliced = file.name.substr(-4);
                    switch (sliced) {
                        case '.mtx':
                            let parser: any = new X2JS();
                            this.http.get(file.nativeURL).map(data => {
                                console.log("mtx moving...");
                                var matrixdata = parser.xml2js(data["_body"]);
                                var matrix = matrixdata.Matrix;
                                matrix._Name = this.fileName;
                                matrix._Channel = this.channelName;
                                return this.core.SaveMatrixAsync(matrixdata, matrix._Channel, matrix._Sport, matrix._Name, "Matrices").then((res) => {
                                    console.log("mtx moved...");
                                });
                            }).toPromise()
                        case '.mp4':
                            return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", this.storageRootDirectory + "SportsPIP/Video", file.name)
                                .subscribe((success) => { console.log("video moved"); });
                        case ".gif":
                        case ".rtf":
                            return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", this.storageRootDirectory + "SportsPIP/Picture", file.name)
                                .subscribe((success) => { console.log("ink moved..."); });
                        case ".jpg":
                            return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", this.storageRootDirectory + "SportsPIP/Picture", file.name)
                                .subscribe(() => { console.log("image moved"); });
                        default:
                    }
                });
            })

        })
    }

    DownloadServerHeader(fileName, channelName): Promise<DirectoryEntry> {
        return this.storagefactory.createFolder(this.storageDataDir, "Temp").then(() => {
            var NewPath = this.storageDataDir + "Temp/";
            return this.storagefactory.createFolder(NewPath, "matrix1").then(() => {
                var matrixPath = NewPath + "matrix1/";
                var oldPath = this.storageDataDir + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
                return this.storagefactory.CopyFile(oldPath, "Header.xml", matrixPath, "Header.xml").then((success) => {
                    const ft = new FileTransfer();
                    var url = encodeURI("https://sportspipstorage.blob.core.windows.net/matrices/" + channelName + "/" + fileName + ".sar");
                    // var url = encodeURI("https://drake.blob.core.windows.net/matrices/Harvest/636049183928404138.sar");
                    ft.download(url, NewPath + "m1.zip",
                        function (entry) {
                            console.log("download complete: " + entry.toURL());
                            return;
                        },
                        function (error) {
                            console.log("download error source " + error.source);
                            console.log("download error target " + error.target);
                            console.log("download error code" + error.code);
                            return;
                        },
                        true);
                    return success["nativeURL"];
                })
            })
        })

    }

    AuthenticateUser(channel, userid) {
        return this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/users/auth/" + channel + "?uid=" + userid + "")
            .map(res => res.json())
            .map(us => {
                console.log('Authenticatnig user..');
                var data = JSON.parse(us);
                return data.Returns;
            }).toPromise();
    }

    unzipPackage() {
        var PathToFileInString = this.storageDataDir + "Temp/m1.zip";
        var PathToResultZip = this.storageDataDir + "Temp/matrix1";
        zip.unzip(PathToFileInString, PathToResultZip)
    }

    DownloadThumbnailfromServer(channelName, matrixName) {
        const ft = new FileTransfer();
        var url = encodeURI("https://sportspipstorage.blob.core.windows.net/thumbnails/" + channelName + "/" + matrixName + ".jpg");
        ft.download(
            url,
            this.storageDataDir + matrixName + ".jpg",
            function (entry) {
                console.log("download complete: " + entry.toURL());
            },
            function (error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
            true);
    }
}