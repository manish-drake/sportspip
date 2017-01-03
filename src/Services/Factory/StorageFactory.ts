import { Injectable } from "@angular/core";
import { Platform, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from './Storage';
import { File, WriteOptions, DirectoryEntry } from 'ionic-native';
import { Logger } from '../../logging/logger';

import 'rxjs/Rx';


@Injectable()
export class StorageFactory {
    writeOptions: WriteOptions = { replace: true }
    private storageRoot: string;
    private storageDataDir: string;

    constructor(private http: Http,
        private storage: Storage,
        private platform: Platform,
        private toastCtrl: ToastController,
        private _logger: Logger) {
            this.storageDataDir = this.storage.externalDataDirectory();
            this.storageRoot = this.storage.externalRootDirectory();
    }
    SaveRoamingHeader(content, channel, sport, matrixName) {
        this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    }

    SaveServerHeader(content, channel, sport, matrixName, typeFolder) {
        this._logger.Debug('Save server header..');
        this.platform.ready().then(() => {
            this.createFolder(this.storageDataDir, "Server").then((success) => {
                var serverFolder = this.storageDataDir + "Server/";
                this.createFolder(serverFolder, channel).then(() => {
                    var channelFolder = serverFolder + channel + "/";
                    this.createFolder(channelFolder, sport).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        this.createFolder(sportFolder, typeFolder).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            this.createFolder(contentFolder, matrixName).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                this.CreateFile(fileLocation, "Header.xml").then(() => {
                                    this.WriteFile(fileLocation, "Header.xml", content)
                                        .then(function (success) {
                                            console.log("server header saved ..")
                                        }).catch((err) => { this._logger.Error('Error,saving server header: ', err); })

                                })
                            })

                        })

                    })
                })
            })
        })
    }

    SaveMatrixAsync(content, channel, sport, matrixName, typeFolder) {
        if (this.platform.is('cordova')) {
            this._logger.Debug('Save matrix async..');
            //create Server Folder
            this.createFolder(this.storageDataDir, "Local").then((success) => {
                var localFolder = this.storageDataDir + "Local/";
                this.createFolder(localFolder, channel).then(() => {
                    var channelFolder = localFolder + channel + "/";
                    this.createFolder(channelFolder, sport).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        this.createFolder(sportFolder, typeFolder).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            this.createFolder(contentFolder, matrixName).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                this.CreateFile(fileLocation, matrixName + ".mtx").then(() => {
                                    this.WriteFile(fileLocation, matrixName + ".mtx", content)
                                        .then(function (success) {
                                            console.log('Saved in SF');
                                        }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                                }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                            }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                        }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                    }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
                }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); })
            }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); });
        }
    }

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder): Promise<any> {
        this._logger.Debug('Save local header..');
        return this.platform.ready().then(() => {
            return this.createFolder(this.storageDataDir, "Local").then((success) => {
                var localFolder = this.storageDataDir + "Local/";
                return this.createFolder(localFolder, channel).then(() => {
                    var channelFolder = localFolder + channel + "/";
                    return this.createFolder(channelFolder, sport).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        return this.createFolder(sportFolder, typeFolder).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            return this.createFolder(contentFolder, matrixName).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                return this.CreateFile(fileLocation, "Header.xml").then(() => {
                                    this.WriteFile(fileLocation, "Header.xml", content)
                                        .then(function (success) {
                                            return success["nativeUrl"]
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
        this._logger.Debug('Deleteing server header..');
        this.platform.ready().then(() => {
            var headerFolder = this.storageDataDir + "Server/" + channel + "/Tennis/Matrices/"
            this.RemoveFileAsync(headerFolder, DirName).then((res) => {
                let toast = this.toastCtrl.create({
                    message: 'Deleted Successfully..',
                    duration: 2000,
                });
                toast.present();
            })
        }).catch((err) => {
            this._logger.Error('Error,deleting server header: ', err);
        })
    }

    DeleteLocalHeader(DirName, channel) {
        this._logger.Debug('Delete local header..');
        this.platform.ready().then(() => {
            var headerFolder = this.storageDataDir + "Local/" + channel + "/Tennis/Matrices/"
            this.RemoveFileAsync(headerFolder, DirName).then((res) => {
                let toast = this.toastCtrl.create({
                    message: 'Deleted Successfully..',
                    duration: 2000,
                });
                toast.present();
            }).catch((err) => { this._logger.Error('Error,deleting local header: ', err); })
        })

    }

    SaveUserAsync(content) {
        this._logger.Debug('Save user async..');
        this.platform.ready().then(() => {
            this.createFolder(this.storageDataDir, "Roaming").then((success) => {
                var serverFolder = this.storageDataDir + "Roaming/";
                this.CreateFile(serverFolder, "User.json").then(() => {
                    this.WriteFile(serverFolder, "User.json", content)
                        .then(function (success) {
                            console.log("registraion complited..");
                        }).catch((err) => { this._logger.Error('Error,saving user async: ', err); })
                }).catch((err) => { this._logger.Error('Error,saving user async: ', err); })
            }).catch((err) => { this._logger.Error('Error,saving user async: ', err); })
        })
    }

    CreateVideoFolder() {
        this.platform.ready().then(() => {
            if (this.platform.is("cordova")) {
                this._logger.Debug('Create video folder..');
                this.createFolder(this.storageRoot, "SportsPIP")
                    .then((success) => {
                        var videoPath = this.storageRoot + "SportsPIP"
                        this.createFolder(videoPath, "Video").then((success) => {
                            console.log("video folder created");
                        }).catch((err) => { this._logger.Error('Error,creating video folder: ', err); })
                    })
                    .catch((err) => { this._logger.Error('Error,creating video folder: ', err); });
            }
        })
    }

    CreatePictureFolder() {
        this.platform.ready().then(() => {
            if (this.platform.is("cordova")) {
                this._logger.Debug('Create Picture folder..');
                this.createFolder(this.storageRoot, "SportsPIP")
                    .then((success) => {
                        var picturePath = this.storageRoot + "SportsPIP"
                        this.createFolder(picturePath, "Picture").then((success) => {
                            console.log("Picture folder created");
                        }).catch((err) => { this._logger.Error('Error,creating Picture folder: ', err); })
                    })
                    .catch((err) => { this._logger.Error('Error,creating Picture folder: ', err); });
            }
        })
    }

    ComposeNewMatrix() {
        this._logger.Debug('Composing new matrix..');
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

    ComposeMatrixHeader(fromMatrix) {
        this._logger.Debug('composing matrix header..');
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

    ComposeHeader(header) {
        var hea = {
            Title: header.Title,
            DateCreated: header.DateCreated,
            Name: header.Name,
            Channel: header.Channel,
            ThumbnailSource: header.ThumbnailSource,
            Sport: header.Sport,
            Skill: header.Skill,
            UploadID: header.UploadID,
            Duration: header.Duration,
            Views: header.Views
        };
        return hea;
    }

    CheckFile(dirpath, fileName): Promise<boolean> {
        return File.checkFile(dirpath, fileName).then((res) => {
            return res;
        })
    }



    createFolder(path: string, dirName: string): Promise<DirectoryEntry> {
        return File.createDir(path, dirName, true).then((res) => {
            return res["nativeUrl"];
        })
    }


    CreateFile(path, fileName): Promise<string> {
        return File.createFile(path, fileName, true).then((success) => {
            return success["nativeUrl"];
        })
    }
    WriteFile(path, fileName, content): Promise<string> {
        return File.writeFile(path, fileName, content, this.writeOptions).then((success) => {
            return success["nativeUrl"]
        })
    }

    CopyFile(oldPath, newPath, fileName): Promise<string> {
        return File.copyFile(oldPath, fileName, newPath, fileName)
            .then((success) => { return success["nativeURL"] });
    }

    MoveFile(oldPath, newPath, fileName): Promise<string> {
        return File.moveFile(oldPath, fileName, newPath, fileName)
            .then((success) => { return success["nativeURL"] });
    }

    RemoveFileAsync(path, dirName) {
        return File.removeRecursively(path, dirName).then((res) => {
            return res;
        }).catch((err) => { return err })
    }

    ReadMatixFileAync(dirName, channelName, matrixname, fileName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(this.storageDataDir + dirName + "/" + channelName + "/Tennis/Matrices/" + matrixname, fileName)
            .then(res => {
                return res;
            }).catch((err) => { this._logger.Error("Error,reading local file async.. ", err) })
    }

    GetLisOfDirectory(path, DirName) {
        return File.listDir(path, DirName).then((success) => {
            return success;
        })
    }

    ReadFileAync(path, dirName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(path, dirName)
            .then(res => {
                return res;
            }).catch((err) => { this._logger.Error("Error,reading local file async.. ", err) })
    }

    // ReadServerFileAync(channelName, matrixname, fileName): Promise<any> {
    //     this._logger.Debug("reading server file async.. ")
    //     return File.readAsText(this.storageDataDir + "Server/" + channelName + "/Tennis/Matrices/" + matrixname, fileName)
    //         .then(res => {
    //             return res;
    //         }).catch((err) => { this._logger.Error("Error,reading server file async.. ", err) })
    // }

    GetLocalHeader(): Promise<any> {
        var localMatrices = [];
        return new Promise((resolve, reject) => {
            return this.GetLisOfDirectory(this.storageDataDir, "Local").then((list) => {
                list.forEach((channelName) => {
                    return this.GetLisOfDirectory(this.storageDataDir + "Local/" + channelName.name + "/Tennis", "Matrices").then((success) => {
                        success.forEach((res) => {
                            return this.ReadMatixFileAync("Local", channelName.name, res.name, "Header.xml").then((data) => {
                                //deserialiae server header  
                                var result = JSON.parse(data.toString());
                                // console.log(result);
                                var item = this.ComposeHeader(result);
                                localMatrices.unshift(item);
                                return resolve(localMatrices);
                            })
                        })

                    })
                })

            })
        })

    }

    GetServerHeader(): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.GetLisOfDirectory(this.storageDataDir, "Server/").then((success) => {
                success.forEach((channelName) => {
                    return this.GetLisOfDirectory(this.storageDataDir, "Server/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                        success.forEach((res) => {
                            return this.ReadMatixFileAync("Server", channelName.name, res.name, "Header.xml")
                                .then(data => {
                                    // deserialiae server header  
                                    var result = JSON.parse(data.toString());
                                    var item = this.ComposeHeader(result);
                                    channels.unshift(item);
                                    resolve(channels);
                                });
                        });
                    });
                })
            }).catch((err) => {
                this._logger.Error('Error,Getting server matrix header..', err);
            });
        })
    }

    GetChannelListByChannel(channel): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.GetLisOfDirectory(this.storageDataDir, "Server/" + channel + "/Tennis/Matrices/").then((success) => {
                success.forEach((res) => {
                    return this.ReadMatixFileAync("Server", channel, res.name, "Header.xml")
                        .then(data => {
                            //deserialiae server header  
                            var result = JSON.parse(data.toString());
                            // var result = header.Header;
                            var item = this.ComposeHeader(result);
                            channels.unshift(item);

                            return resolve(channels);
                        });
                });

            });
        })

    }
}