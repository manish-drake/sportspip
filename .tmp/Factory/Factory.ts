import { Injectable, Input } from "@angular/core";
import { NavController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { File } from 'ionic-native';
declare var cordova: any;
import 'rxjs/Rx';

@Injectable()
export class Factory {

    constructor(private http: Http, private platform: Platform) {
    }

    SaveRoamingHeader(content, channel, sport, matrixName) {
        this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    }

    SaveServerHeader(content, channel, sport, matrixName, typeFolder) {

        this.platform.ready().then(() => {
            const fs: string = cordova.file.dataDirectory;

            //create Server Folder
            File.createDir(fs, "Server", true).then((success) => {
                var serverFolder = fs + "Server/";
                File.createDir(serverFolder, channel, true).then(() => {
                    var channelFolder = serverFolder + channel + "/";
                    File.createDir(channelFolder, sport, true).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        File.createDir(sportFolder, typeFolder, true).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            File.createDir(contentFolder, matrixName, true).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                File.createFile(fileLocation, "Header.xml", true).then(() => {
                                    File.writeFile(fileLocation, "Header.xml", content, true)
                                        .then(function (success) {
                                            alert("created");
                                        })

                                })
                            })

                        })

                    })
                })
            })
        })
    }

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder) {

        this.platform.ready().then(() => {
            const fs: string = cordova.file.dataDirectory;

            //create Server Folder
            File.createDir(fs, "Local", true).then((success) => {
                var serverFolder = fs + "Local/";
                File.createDir(serverFolder, channel, true).then(() => {
                    var channelFolder = serverFolder + channel + "/";
                    File.createDir(channelFolder, sport, true).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        File.createDir(sportFolder, typeFolder, true).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            File.createDir(contentFolder, matrixName, true).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                File.createFile(fileLocation, "Header.xml", true).then(() => {
                                    File.writeFile(fileLocation, "Header.xml", content, true)
                                        .then(function (success) {

                                        })

                                })
                            })

                        })

                    })
                })
            })
        })
    }


    DeleteServerHeader(DirName) {
        this.platform.ready().then(() => {
            var headerFolder = cordova.file.dataDirectory + "Server/Mayfair/Tennis/Matrices/"
            File.removeRecursively(headerFolder, DirName).then(() => {
                alert("Deleted successfully");
            })
        })
    }
}