import { Injectable } from "@angular/core";
import { Platform, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
declare var cordova: any;
import 'rxjs/Rx';

@Injectable()
export class StorageFactory {

    constructor(private http: Http, private platform: Platform, private toastCtrl: ToastController, ) {
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

                                        })

                                })
                            })

                        })

                    })
                })
            })
        })
    }

    SaveMatrixAsync(content, channel, sport, matrixName, typeFolder) {
        this.platform.ready().then(() => {
            const fs: string = cordova.file.dataDirectory;

            //create Server Folder
            File.createDir(fs, "Local", true).then((success) => {
                var localFolder = fs + "Local/";
                File.createDir(localFolder, channel, true).then(() => {
                    var channelFolder = localFolder + channel + "/";
                    File.createDir(channelFolder, sport, true).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        File.createDir(sportFolder, typeFolder, true).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            File.createDir(contentFolder, matrixName, true).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                File.createFile(fileLocation, matrixName + ".mtx", true).then(() => {
                                    File.writeFile(fileLocation, matrixName + ".mtx", content, true)
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

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder) {

        this.platform.ready().then(() => {
            const fs: string = cordova.file.dataDirectory;

            //create local Folder
            File.createDir(fs, "Local", true).then((success) => {
                var localFolder = fs + "Local/";
                File.createDir(localFolder, channel, true).then(() => {
                    var channelFolder = localFolder + channel + "/";
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


    DeleteServerHeader(DirName, channel) {
        this.platform.ready().then(() => {
            var headerFolder = cordova.file.dataDirectory + "Server/" + channel + "/Tennis/Matrices/"
            File.removeRecursively(headerFolder, DirName).then(() => {
                let toast = this.toastCtrl.create({
                    message: 'Deleted Successfully..',
                    duration: 2000,
                });
                toast.present();
            })
        })
    }

    DeleteLocalHeader(DirName, channel) {
        this.platform.ready().then(() => {
            var headerFolder = cordova.file.dataDirectory + "Local/" + channel + "/Tennis/Matrices/"
            File.removeRecursively(headerFolder, DirName).then(() => {
                let toast = this.toastCtrl.create({
                    message: 'Deleted Successfully..',
                    duration: 2000,
                });
                toast.present();
            })
        })
    }

    SaveUserAsync(content) {
        this.platform.ready().then(() => {
            const fs: string = "file:/storage/emulated/0/DCIM";
            File.createDir(fs, "Server", true).then((success) => {
                var serverFolder = fs + "/Server/";
                File.createFile(serverFolder, "User.json", true).then(() => {
                    File.writeFile(serverFolder, "User.json", content, true)
                        .then(function (success) {
                            console.log("registraion complited..");
                        })
                })
            })
        })

    }
}