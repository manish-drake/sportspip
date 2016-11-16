import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
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
        this.fileName = Date.now().toString();
        this.platform.ready().then(() => {
            this.http.get(cordova.file.dataDirectory + "Temp/matrix1/Header.xml").subscribe((result => {
                console.log("header moving..");
                var header = JSON.parse(result.text());
                header.Name = this.fileName;
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
                            this.http.get(file.nativeURL).subscribe(data => {
                                console.log("mtx moving...");
                                var matrixdata = parser.xml2js(data["_body"]);
                                var matrix = matrixdata.Matrix;
                                console.log(this.fileName);
                                matrix._Name = this.fileName;
                                matrix.Channel = this.channelName;
                                this.storagefactory.SaveMatrixAsync(matrixdata, matrix.Channel, matrix._Sport, matrix._Name, "Matrices");
                                console.log("mtx moved");
                            })
                            break;
                        case '.mp4':
                            console.log("video moving...");
                            File.copyFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, cordova.file.applicationStorageDirectory, file.name);
                            console.log("video moved");
                            break;
                        case ".gif":
                        case ".rtf":
                            File.copyFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, cordova.file.applicationStorageDirectory, file.name);
                            break;
                        case ".jpg":
                            File.copyFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, cordova.file.applicationStorageDirectory, file.name);
                            break;
                        default:
                    }
                });
            })

        })
    }

    DownloadServerHeader(fileName, channelName) {
        this.platform.ready().then(() => {
            File.createDir(cordova.file.dataDirectory, "Temp", true).then(() => {
                var NewPath = cordova.file.dataDirectory + "Temp/";
                File.createDir(NewPath, "matrix1", true).then(() => {
                    var matrixPath = NewPath + "matrix1/";
                    var oldPath = cordova.file.dataDirectory + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
                    File.copyFile(oldPath, "Header.xml", matrixPath, "Header.xml").then(() => {
                        const ft = new FileTransfer();
                        var url = encodeURI("https://drake.blob.core.windows.net/matrices/" + channelName + "/" + fileName + ".sar");
                        ft.download(
                            url,
                            NewPath + "m1.zip",
                            function (entry) {
                                console.log("download complete: " + entry.toURL());
                            },
                            function (error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("download error code" + error.code);
                            },
                            true);
                    })
                })
            })
        })

    }

    unzipPackage() {
        this.platform.ready().then(() => {
            var PathToFileInString = cordova.file.dataDirectory + "Temp/m1.zip";
            var PathToResultZip = cordova.file.dataDirectory + "Temp/matrix1";
            zip.unzip(PathToFileInString, PathToResultZip);
        })

    }

    DownloadThumbnailfromServer(channelName, matrixName) {
        const ft = new FileTransfer();
        var url = encodeURI("https://drake.blob.core.windows.net/thumbnails/" + channelName + "/" + matrixName + ".jpg");
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

    FormateDate(value) {
        var st = value;
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
        return date.toDateString().slice(4, 10)

    }
}