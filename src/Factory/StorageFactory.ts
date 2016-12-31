import { Injectable } from "@angular/core";
import { Platform, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'Rxjs';
import { File, WriteOptions, FileEntry,DirectoryEntry } from 'ionic-native';
import { Logger } from '../logging/logger';

declare var cordova: any;
import 'rxjs/Rx';


@Injectable()
export class StorageFactory {
    writeOptions: WriteOptions = { replace: true }
    private storageRoot: string;
    private storageDataDir: string;

    constructor(private http: Http, private platform: Platform, private toastCtrl: ToastController, private _logger: Logger) {
        if (this.platform.is('cordova')) {
            this.storageDataDir = cordova.file.externalDataDirectory;
            this.storageRoot = cordova.file.externalRootDirectory;
        }
    }
    SaveRoamingHeader(content, channel, sport, matrixName) {
        this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    }

    SaveServerHeader(content, channel, sport, matrixName, typeFolder) {
        this._logger.Debug('Save server header..');
        try {
            this.platform.ready().then(() => {
                File.createDir(this.storageDataDir, "Server", true).then((success) => {
                    var serverFolder = this.storageDataDir + "Server/";
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
        if (this.platform.is('cordova')) {
            this._logger.Debug('Save matrix async..');
            //create Server Folder
            return File.createDir(this.storageDataDir, "Local", true).then((success) => {
                var localFolder = this.storageDataDir + "Local/";
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
            }).catch((err) => { this._logger.Error('Error,saving matrix async: ', err); });
        }
    }

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder) {
        this._logger.Debug('Save local header..');
        this.platform.ready().then(() => {

            //create local Folder
            File.createDir(this.storageDataDir, "Local", true).then((success) => {
                var localFolder = this.storageDataDir + "Local/";
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

            File.createDir(this.storageDataDir, "Roaming", true).then((success) => {
                var serverFolder = this.storageDataDir + "Roaming/";
                File.createFile(serverFolder, "User.json", true).then(() => {
                    File.writeFile(serverFolder, "User.json", content, this.writeOptions)
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
                File.createDir(this.storageRoot, "SportsPIP", true)
                    .then((success) => {
                        var videoPath = this.storageRoot + "SportsPIP"
                        File.createDir(videoPath, "Video", true).then((success) => {
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
                File.createDir(this.storageRoot, "SportsPIP", true)
                    .then((success) => {
                        var picturePath = this.storageRoot + "SportsPIP"
                        File.createDir(picturePath, "Picture", true).then((success) => {
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

    createFolderRx(fullPath: string/*DCIM/rootFolder/File/*/, parentFullPath: string/*file:/storage/emulated/0*/): Promise<DirectoryEntry> {
        var urlParts = fullPath.split("/");
        if (urlParts.length > 0) {
            var name = urlParts[0];
            if (!parentFullPath)
                parentFullPath = "file:/storage/emulated/0";
            return File.createDir(parentFullPath, name, true).then(success => {
                parentFullPath += "/" + name;
                if (urlParts.length >= 2) {
                    fullPath = urlParts.slice(1).join("/");
                } else {
                    return success["nativeURL"];
                }
                return this.createFolderRx(fullPath, parentFullPath);
            });
        }
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

    CopyFile(oldPath, fileName, newPath, newFileName) {

    }

    MoveFile() {

    }

    RemoveFileAsync(path, dirName) {
        return File.removeRecursively(path, dirName).then((res) => {
            return res;
        }).catch((err) => { return err })
    }

    ReadFileAync(dirName, channelName, matrixname, fileName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(this.storageDataDir + dirName + "/" + channelName + "/Tennis/Matrices/" + matrixname, fileName)
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
                            return this.ReadFileAync("Local", channelName.name, res.name, "Header.xml").then((data) => {
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
                            return this.ReadFileAync("Server", channelName.name, res.name, "Header.xml")
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
                    return this.ReadFileAync("Server", channel, res.name, "Header.xml")
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

    GetLisOfDirectory(path, DirName) {
        return File.listDir(path, DirName).then((success) => {
            return success;
        })
    }
}