import { Injectable } from "@angular/core";
import { Platform, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { File, WriteOptions, FileEntry } from 'ionic-native';
import { Logger } from '../logging/logger';

declare var cordova: any;
import 'rxjs/Rx';

@Injectable()
export class StorageFactory {
    writeOptions: WriteOptions = { replace: true }

    constructor(private http: Http, private platform: Platform, private toastCtrl: ToastController, private _logger: Logger) {
    }
    SaveRoamingHeader(content, channel, sport, matrixName) {
        this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    }

    SaveServerHeader(content, channel, sport, matrixName, typeFolder) {
        this._logger.Debug('Save server header..');
        try {
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
                                        File.writeFile(fileLocation, "Header.xml", content, this.writeOptions)
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
        catch (err) {
            this._logger.Error('Error,saving server header: ', err);
        }
    }

    SaveMatrixAsync(content, channel, sport, matrixName, typeFolder): Promise<FileEntry> {
        this._logger.Debug('Save matrix async..');

        const fs: string = cordova.file.dataDirectory;
        //create Server Folder
        return File.createDir(fs, "Local", true).then((success) => {
            var localFolder = fs + "Local/";
            return File.createDir(localFolder, channel, true).then(() => {
                var channelFolder = localFolder + channel + "/";
                return File.createDir(channelFolder, sport, true).then(() => {
                    var sportFolder = channelFolder + sport + "/";
                    return File.createDir(sportFolder, typeFolder, true).then(() => {
                        var contentFolder = sportFolder + typeFolder + "/";
                        return File.createDir(contentFolder, matrixName, true).then((success) => {
                            var fileLocation = contentFolder + matrixName;
                            return File.createFile(fileLocation, matrixName + ".mtx", true).then(() => {
                                return File.writeFile(fileLocation, matrixName + ".mtx", content, this.writeOptions)
                                    .then(function (success) {
                                        console.log('Saved in SF');
                                        return success["nativeUrl"]
                                    }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                            }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                        }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                    }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
            }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
        }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
    }

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder) {
        this._logger.Debug('Save local header..');
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
                                    File.writeFile(fileLocation, "Header.xml", content, this.writeOptions)
                                        .then(function (success) {
                                            console.log("saved local header");
                                        }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
                                }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
                            }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
                        }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
                    }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
                }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
            }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
        }).catch((err) => { this._logger.Error('Error,saving local header: ', err); })
    }


    DeleteServerHeader(DirName, channel) {
        this._logger.Debug('Delete server header..');
        try {
            this.platform.ready().then(() => {
                var headerFolder = cordova.file.dataDirectory + "Server/" + channel + "/Tennis/Matrices/"
                File.removeRecursively(headerFolder, DirName).then(() => {
                    console.log('Deleted Successfully.');
                })
            })
        }
        catch (err) {
            this._logger.Error('Error,deleting server header: ', err);
        }
    }

    DeleteLocalHeader(DirName, channel) {
        this._logger.Debug('Delete local header..');
        try {
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
        catch (err) {
            this._logger.Error('Error,deleting local header: ', err);
        }
    }

    SaveUserAsync(content) {
        this._logger.Debug('Save user async..');
        try {
            this.platform.ready().then(() => {
                const fs: string = cordova.file.dataDirectory;
                File.createDir(fs, "Server", true).then((success) => {
                    var serverFolder = fs + "Server/";
                    File.createFile(serverFolder, "User.json", true).then(() => {
                        File.writeFile(serverFolder, "User.json", content, this.writeOptions)
                            .then(function (success) {
                                console.log("registraion complited..");
                            })
                    })
                })
            })
        }
        catch (err) {
            this._logger.Error('Error,saving user async: ', err);
        }
    }

    CreateVideoFolder() {
        this._logger.Debug('Create video folder..');
        try {
            this.platform.ready().then(() => {
                const fs: string = cordova.file.externalRootDirectory;
                File.createDir(fs, "SportsPIP", true).then((success) => {
                    var videoPath = fs + "SportsPIP"
                    File.createDir(videoPath, "Video", true).then((success) => {
                        console.log("video folder created");
                    })
                })
            })
        }
        catch (err) {
            this._logger.Error('Error,creating video folder: ', err);
        }
    }

    ComposeNewMatrix() {
        this._logger.Debug('Compose new matrix..');
        try {
            var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
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
        catch (err) {
            this._logger.Error('Error,composing new matrix: ', err);
        }
    }

    ComposeMatrixHeader(fromMatrix) {
        this._logger.Debug('composing matrix header..');
        try {
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
        catch (err) {
            this._logger.Error('Error,composing matrix header: ', err);
        }
    }

    ComposeNewMatrixHeader(fromMatrix) {
        this._logger.Debug('composing new matrix header..');
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


    ReadLocalFileAync(channelName, matrixname, fileName): Promise<any> {
        this._logger.Debug("reading file async.. ")
        return File.readAsText(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices/" + matrixname, fileName)
            .then(res => {
                return res;
            }).catch((err) => { this._logger.Error("Error,reading file async.. ", err) })
    }

    GetLocalHeader(): Promise<any> {
        var localMatrices = [];
        return new Promise((resolve, reject) => {
            return this.GetLisOfDirectory(cordova.file.dataDirectory, "Local/").then((list) => {
                list.forEach((channelName) => {
                    return this.GetLisOfDirectory(cordova.file.dataDirectory, "Local/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                        success.forEach((res) => {
                            return this.ReadLocalFileAync(channelName.name, res.name, "Header.xml").then((data) => {
                                //deserialiae server header  
                                var result = JSON.parse(data.toString());
                                // console.log(result);
                                var item = {
                                    Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
                                    ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                                    Views: result.Views
                                };
                                localMatrices.unshift(item)
                                resolve(localMatrices);
                            })
                        })

                    })
                })

            })
        })

    }

    GetLisOfDirectory(path, DirName) {
        return File.listDir(path, DirName).then((success) => {
            return success;
        })
    }
}