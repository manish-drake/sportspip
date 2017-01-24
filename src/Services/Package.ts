import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { DirectoryEntry, Zip } from 'ionic-native';

import { StorageFactory } from './Factory/StorageFactory';
import { Core } from './core';
import { Storage } from './Factory/Storage';
import { HttpService } from './httpService';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import X2JS from 'x2js';

declare var FileTransfer: any;
declare var navigator: any;


@Injectable()
export class Package {

    private storageDataDir: string;
    private storageRootDirectory: string;
    constructor(private httpService: HttpService,
        private storage: Storage,
        private core: Core,
        private platform: Platform,
        private storagefactory: StorageFactory) {

        this.storage.externalDataDirectory().then((res) => {
            this.storageDataDir = res;
            this.storage.externalRootDirectory().then((res1) => {
                this.storageRootDirectory = res1;
            })
        });
    }

    public fileName: any;
    public channelName: any;

    MoveToLocalCollection(channelName) {
        this.fileName = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        return this.storagefactory.ReadFileAync(this.storageDataDir + "Temp/matrix1", "Header.xml").map((result => {
            console.log("header moving..");
            var header = JSON.parse(result.toString());
            header.Name = this.fileName;
            header.DateCreated = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
            header.ThumbnailSource = header.UploadID;
            this.channelName = header.Channel;
            return this.core.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices").then((res) => {
                console.log("header moved");
                return this.storagefactory.GetLisOfDirectory(this.storageDataDir + "Temp", "matrix1").then((success) => {
                    return success.forEach(file => {
                        var sliced = file.name.substr(-4);
                        switch (sliced) {
                            case '.mtx':
                                let parser: any = new X2JS();
                                return this.storagefactory.ReadFileAync(this.storageDataDir + "Temp/matrix1", file.name).subscribe(data => {
                                    console.log("mtx moving...");
                                    var matrixdata = parser.xml2js(data.toString());
                                    var matrix = matrixdata.Matrix;
                                    matrix._Name = this.fileName;
                                    matrix._Channel = this.channelName;
                                    return this.core.SaveMatrixAsync(matrixdata, matrix._Channel, matrix._Sport, matrix._Name, "Matrices").then((res) => {
                                        console.log("mtx moved...");
                                        file.remove(() => {
                                            return res;
                                        })

                                    });
                                })
                            case '.mp4':
                                return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", file.name, this.storageRootDirectory + "SportsPIP/Video", file.name)
                                    .subscribe((success) => {
                                        console.log("video moved");
                                        file.remove(() => {
                                            return success;
                                        })
                                    });
                            case ".gif":
                            case ".rtf":
                            case ".jpg":
                                return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", file.name, this.storageRootDirectory + "SportsPIP/Picture", file.name)
                                    .subscribe((success) => {
                                        console.log("images or ink or gif moved...");
                                        file.remove(() => {
                                            return success;
                                        })
                                    });
                            default:
                        }
                    });
                })
            });

        }));
    }

    DownloadServerHeader(fileName, channelName): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.storagefactory.createFolder(this.storageDataDir, "Temp").subscribe(() => {
                var NewPath = this.storageDataDir + "Temp/";
                return this.storagefactory.createFolder(NewPath, "matrix1").subscribe(() => {
                    var matrixPath = NewPath + "matrix1/";
                    var oldPath = this.storageDataDir + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
                    return this.storagefactory.CopyFile(oldPath, "Header.xml", matrixPath, "Header.xml").subscribe((success) => {
                        const ft = new FileTransfer();
                        var url = encodeURI("https://sportspipstorage.blob.core.windows.net/matrices/" + channelName + "/" + fileName + ".sar");
                        // var url = encodeURI("https://drake.blob.core.windows.net/matrices/Harvest/636049183928404138.sar");
                        ft.download(url, NewPath + "m1.zip",
                            function (entry) {
                                console.log("download complete: " + entry.toURL());
                                resolve(true);
                            },
                            function (error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("download error code" + error.code);
                                reject(error);
                            },
                            true);
                    })
                })
            })
        })
    }

    AuthenticateUser(channel, userid) {
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/users/auth/" + channel + "?uid=" + userid)
            .then(us => {
                console.log('Authenticatnig user..');
                var data = JSON.parse(us);
                return data.Returns;
            })
    }

    unzipPackage() {
        var PathToFileInString = this.storageDataDir + "Temp/m1.zip";
        var PathToResultZip = this.storageDataDir + "Temp/matrix1";
        return Zip.unzip(PathToFileInString, PathToResultZip, (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
            .then((res) => {
                console.log("Unzipping....")
                return res;
            })
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