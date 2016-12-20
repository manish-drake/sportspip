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
                                            console.log("server header saved ..")
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
                                            console.log('Saved in SF');
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
                                            console.log("saved local header");
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
                console.log('Deleted Successfully.');
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
            const fs: string = cordova.file.dataDirectory;
            File.createDir(fs, "Server", true).then((success) => {
                var serverFolder = fs + "Server/";
                File.createFile(serverFolder, "User.json", true).then(() => {
                    File.writeFile(serverFolder, "User.json", content, true)
                        .then(function (success) {
                            console.log("registraion complited..");
                        })
                })
            })
        })

    }

    ComposeNewMatrix() {
        var name =(new Date()).toISOString().replace(/[^0-9]/g, "").slice(0,14);
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
        var header = {
            Title: fromMatrix._Title,
            DateCreated: fromMatrix._DateCreated,
            Name: fromMatrix._Name,
            Channel: fromMatrix._Channel,
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
        var header = {
            Title: fromMatrix._Title,
            DateCreated: fromMatrix._DateCreated,
            Name: fromMatrix._Name,
            Channel: fromMatrix._Channel,
            ThumbnailSource: "thumbnail",
            Sport: fromMatrix._Sport,
            Skill: fromMatrix._Skill,
            UploadID: "0",
            Duration: fromMatrix._Duration,
            Views: "1"
        };
        return header;

    }
}