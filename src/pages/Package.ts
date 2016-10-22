import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Http } from '@angular/http';
import { File, Transfer } from 'ionic-native';
import 'rxjs/Rx';
declare var cordova: any;
declare var zip: any;
declare var require: any;


@Injectable()
export class Package {

    constructor(private http: Http, private platform: Platform, private storagefactory: StorageFactory) {
    }

    public fileName: any;
    public channelName:any;

    MoveToLocalCollection() {
        this.http.get("file:/storage/emulated/0/DCIM/Temp/matrix1/Header.xml").subscribe((result => {
            var header = JSON.parse(result.text());
            this.fileName = header.name;
            this.channelName=header.Channel;
            // this.storagefactory.SaveLocalHeader(result.text(), header.Channel, header.Sport, header.name, "Matrices");
        }));
        File.listDir("file:/storage/emulated/0/DCIM/Temp/", "matrix1").then((success) => {
            success.forEach(file => {
                var sliced = file.name.substr(-4);
                switch (sliced) {
                    case '.mtx':
                        var x2js = require("xml2js");                     
                        this.http.get(file.nativeURL).subscribe(data => {
                            x2js.parseString(data["_body"], function (Err, result) {
                                var data1 = result.Matrix.$;
                                data1.Name = this.fileName;
                                data1.Channel=this.channelName;
                                alert(data1.Channel);
                                // this.SaveMatrixAsync(data["_body"], "DiSports", data1.Sport, "matrix1", "matrices");
                            });
                        })
                        break;
                    case '.mp4':
                        break;
                    case ".gif":
                    case ".rtf":
                        break;
                    case ".jpg":
                        break;
                    default:
                }
            });
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

    DownloadServerHeader(fileName, channelName) {
        this.platform.ready().then(() => {
            File.createDir("file:/storage/emulated/0/DCIM/", "Temp", true).then(() => {
                var NewPath = "file:/storage/emulated/0/DCIM/" + "Temp/";
                File.createDir(NewPath, "matrix1", true).then(() => {
                    var matrixPath = NewPath + "matrix1/";
                    var oldPath = cordova.file.dataDirectory + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
                    File.copyFile(oldPath, "Header.xml", matrixPath, "Header.xml").then(() => {
                        const ft = new Transfer();
                        ft.download("https://drake.blob.core.windows.net/matrices/" + channelName + "/" + fileName + ".sar", "file:/storage/emulated/0/DCIM/Temp/m1.zip", true)
                            .then((success) => {
                                alert(success.fullPath);
                            });
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