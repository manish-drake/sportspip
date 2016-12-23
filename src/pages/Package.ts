import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Http } from '@angular/http';
import { File, DirectoryEntry } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import X2JS from 'x2js';

declare var cordova: any;
declare var zip: any;
declare var FileTransfer: any;
declare var navigator: any;


@Injectable()
export class Package {
    constructor(private http: Http, private platform: Platform, private storagefactory: StorageFactory) {

    }

    public fileName: any;
    public channelName: any;

    MoveToLocalCollection(channelName) {
        this.fileName = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        this.platform.ready().then(() => {
            File.readAsText(cordova.file.dataDirectory + "Temp/matrix1", "Header.xml").then((result => {
                console.log("header moving..");
                var header = JSON.parse(result.toString());
                header.Name = this.fileName;
                header.DateCreated = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
                header.ThumbnailSource = header.UploadID;
                this.channelName = header.Channel;
                this.storagefactory.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices");
                console.log("header moved");
            }));
            File.listDir(cordova.file.dataDirectory + "Temp/", "matrix1").then((success) => {
                success.forEach(file => {
                    var sliced = file.name.substr(-4);
                    switch (sliced) {
                        case '.mtx':
                            let parser: any = new X2JS();
                            return this.http.get(file.nativeURL).map(data => {
                                console.log("mtx moving...");
                                var matrixdata = parser.xml2js(data["_body"]);
                                var matrix = matrixdata.Matrix;
                                matrix._Name = this.fileName;
                                matrix._Channel = this.channelName;
                                return this.storagefactory.SaveMatrixAsync(matrixdata, matrix._Channel, matrix._Sport, matrix._Name, "Matrices").then(() => {
                                    console.log("mtx moved");
                                });

                            }).toPromise()
                        case '.mp4':
                            console.log("video moving...");
                            return File.moveFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, cordova.file.externalRootDirectory + "SportsPIP/Video", file.name)
                                .then((success) => { console.log("video moved"); });
                        case ".gif":
                        case ".rtf":
                            console.log("ink moving...");
                            return File.moveFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, cordova.file.applicationStorageDirectory, file.name)
                                .then((success) => { console.log("ink moved..."); });
                        case ".jpg":
                            console.log("image moving...");
                            return File.moveFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, cordova.file.applicationStorageDirectory, file.name)
                                .then(() => { console.log("image moved"); });
                        default:
                    }
                });
            })

        })
    }

    DownloadServerHeader(fileName, channelName): Promise<DirectoryEntry> {
        return File.createDir(cordova.file.dataDirectory, "Temp", true).then(() => {
            var NewPath = cordova.file.dataDirectory + "Temp/";
            return File.createDir(NewPath, "matrix1", true).then(() => {
                var matrixPath = NewPath + "matrix1/";
                var oldPath = cordova.file.dataDirectory + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
                return File.copyFile(oldPath, "Header.xml", matrixPath, "Header.xml").then((success) => {
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
        var PathToFileInString = cordova.file.dataDirectory + "Temp/m1.zip";
        var PathToResultZip = cordova.file.dataDirectory + "Temp/matrix1";
        zip.unzip(PathToFileInString, PathToResultZip)
    }

    DownloadThumbnailfromServer(channelName, matrixName) {
        const ft = new FileTransfer();
        var url = encodeURI("https://sportspipstorage.blob.core.windows.net/thumbnails/" + channelName + "/" + matrixName + ".jpg");
        ft.download(
            url,
            cordova.file.applicationStorageDirectory + matrixName + ".jpg",
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

    FormatDate(value) {
        var st = value;
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
        return date.toDateString().slice(4, 10)

    }

    FormatDuration(dur) {
        if (dur != null) {
            var hrs = Number(dur.slice(0, 2));
            var h = (hrs == 0) ? "" : hrs + 'h ';
            var mins = Number(dur.slice(3, 5));
            var m = (mins == 0) ? "" : mins + 'm ';
            var secs = Number(dur.slice(6, 8));
            var s = secs + 's';
            return h + m + s;
        }
        else {
            return "";
        }
    }
}