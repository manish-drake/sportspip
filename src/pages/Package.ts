import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
declare var cordova: any;
import 'rxjs/Rx';

@Injectable()
export class Package {

    constructor(private http: Http, private platform: Platform,private storagefactory:StorageFactory) {
    }



    MoveToLocalCollection() {

        var headerPath = cordova.file.dataDirectory + "Temp/matrix1/Header.xml";
        this.http.get(headerPath).subscribe(data => {
            var result = JSON.parse(data.text());
            alert("Move Header");
            this.storagefactory.SaveLocalHeader(data.text(), result.Header.Channel, result.Header.Sport, "matrix1", "Matrices");
        })
        var matrixPath = cordova.file.dataDirectory + "Temp/matrix1/matrix1.xml";
        this.http.get(matrixPath).subscribe(data => {
            var result = JSON.parse(data.text());
             alert("Move Matrix");
            this.storagefactory.SaveMatrixAsync(data.text(), result.Matrix.Channel, result.Matrix.Sport, "matrix1", "Matrices");
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
                        this.http.get("assets/matrix1.mtx")
                            .subscribe(data => {
                                File.createFile(matrixPath, "matrix1.xml", true).then(() => {
                                    File.writeFile(matrixPath, "matrix1.xml", data.text(), true)
                                        .then(function (success) {
                                            alert("Downlaod");
                                        })
                                })
                            })
                    })
                })
            })
        })
    }

}