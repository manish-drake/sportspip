import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Http } from '@angular/http';
import { File, Transfer } from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';
import X2JS from 'x2js';
declare var cordova: any;
declare var zip: any;
declare var FileTransfer: any;


@Injectable()
export class Package {

    constructor(private http: Http, private platform: Platform, private storagefactory: StorageFactory) {
    }

    public fileName: any;
    public channelName: any;

    MoveToLocalCollection() {

        this.platform.ready().then(() => {
            console.log(cordova.file.applicationStorageDirectory);
            this.http.get("file:/storage/emulated/0/DCIM" + "/Temp/matrix1/Header.xml").subscribe((result => {
                var header = JSON.parse(result.text());
                this.fileName = header.Name;
                this.channelName = header.Channel;
                this.storagefactory.SaveLocalHeader(result.text(), header.Channel, header.Sport, header.Name, "Matrices");
                console.log("header move");
            }));
            File.listDir("file:/storage/emulated/0/DCIM/" + "Temp/", "matrix1").then((success) => {
                success.forEach(file => {
                    var sliced = file.name.substr(-4);
                    switch (sliced) {
                        case '.mtx':
                            let parser: any = new X2JS();
                            this.http.get(file.nativeURL).subscribe(data => {
                                var jsonObj = parser.xml2js(data["_body"]);
                                var matrix = jsonObj.Matrix;
                                matrix._Name = this.fileName;
                                matrix.Channel = this.channelName;
                                this.save();
                                this.storagefactory.SaveMatrixAsync(matrix, matrix.Channel, matrix._Sport, matrix._Name, "matrices");
                                console.log("mtx move");
                            })
                            break;
                        case '.mp4':
                            File.copyFile("file:/storage/emulated/0/DCIM/Temp/matrix1", file.name, cordova.file.applicationStorageDirectory, file.name);
                            console.log("video move");
                            break;
                        case ".gif":
                        case ".rtf":
                            File.copyFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, "file:/storage/emulated/0/DCIM", file.name);
                            break;
                        case ".jpg":
                            File.copyFile(cordova.file.dataDirectory + "Temp/matrix1", file.name, "file:/storage/emulated/0/DCIM", file.name);
                            break;
                        default:
                    }
                });

                File.removeDir("file:/storage/emulated/0/DCIM", "Temp");
            })

        })


        // var headerPath = cordova.file.dataDirectory + "Temp/matrix1/Header.xml";
        // this.http.get(headerPath).subscribe(data => {
        //     var result = JSON.parse(data.text());
        //     this.storagefactory.SaveLocalHeader(data.text(), result.Header.Channel, result.Header.Sport, result.Header.name, "Matrices");
        // })
        // var matrixPath = cordova.file.dataDirectory + "Temp/matrix1/matrix1.xml";
        // this.http.get(matrixPath).subscribe(data => {
        //     var result = JSON.parse(data.text());
        //     this.storagefactory.SaveMatrixAsync(data.text(), result.Matrix.Channel, result.Matrix.Sport, result.Matrix.name, "Matrices");
        // })
    }



    save() {
        this.platform.ready().then(() => {
            File.createDir(cordova.file.applicationStorageDirectory, "Video", true).then((success) => {
                console.log(success);
            })
        })

    }

    DownloadServerHeader(fileName, channelName) {
        this.platform.ready().then(() => {
            File.createDir("file:/storage/emulated/0/DCIM", "Temp", true).then(() => {
                var NewPath = "file:/storage/emulated/0/DCIM" + "/Temp/";
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
            var PathToFileInString = "file:/storage/emulated/0/DCIM/Temp/m1.zip";
            var PathToResultZip = "file:/storage/emulated/0/DCIM/Temp/matrix1";
            zip.unzip(PathToFileInString, PathToResultZip);
        })

    }

}