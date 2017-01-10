import { Injectable } from "@angular/core";
import { ModelFactory } from './Factory/ModelFactory';
import { Platform, ToastController } from 'ionic-angular';
import { Logger } from '../logging/logger';
import { StorageFactory } from './Factory/StorageFactory';
import { Storage } from './Factory/Storage';

@Injectable()
export class Core {
    storageDataDir: string;
    storageRoot: string;
    constructor(private storageFactory: StorageFactory, private modelFactory: ModelFactory,
        private storage: Storage,
        private toastCtrl: ToastController,
        private platform: Platform,
        private _logger: Logger) {
        platform.ready().then(() => {
            this.storageDataDir = this.storage.externalDataDirectory();
            this.storageRoot = this.storage.externalRootDirectory();
        })
    }

    SaveRoamingHeader(content, channel, sport, matrixName) {
        this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    }

    SaveServerHeader(content, channel, sport, matrixName, typeFolder) {
        this._logger.Debug('Save server header..');
        this.platform.ready().then(() => {
            this.storageFactory.createFolder(this.storageDataDir, "Server").then((success) => {
                var serverFolder = this.storageDataDir + "Server/";
                this.storageFactory.createFolder(serverFolder, channel).then(() => {
                    var channelFolder = serverFolder + channel + "/";
                    this.storageFactory.createFolder(channelFolder, sport).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        this.storageFactory.createFolder(sportFolder, typeFolder).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            this.storageFactory.createFolder(contentFolder, matrixName).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                this.storageFactory.CreateFile(fileLocation, "Header.xml").then(() => {
                                    this.storageFactory.WriteFile(fileLocation, "Header.xml", JSON.stringify(content))
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

    SaveMatrixAsync(content, channel, sport, matrixName, typeFolder): Promise<any> {
        if (this.platform.is('cordova')) {
            this._logger.Debug('Save matrix async..');
            //create Server Folder
            return this.storageFactory.createFolder(this.storageDataDir, "Local").then((success) => {
                var localFolder = this.storageDataDir + "Local/";
                return this.storageFactory.createFolder(localFolder, channel).then(() => {
                    var channelFolder = localFolder + channel + "/";
                    return this.storageFactory.createFolder(channelFolder, sport).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        return this.storageFactory.createFolder(sportFolder, typeFolder).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            return this.storageFactory.createFolder(contentFolder, matrixName).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                return this.storageFactory.CreateFile(fileLocation, matrixName + ".mtx").then(() => {
                                    return this.storageFactory.WriteFile(fileLocation, matrixName + ".mtx", JSON.stringify(content))
                                        .then(function (success) {
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

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder): Promise<string> {
        this._logger.Debug('Save local header..');
        return this.platform.ready().then(() => {
            return this.storageFactory.createFolder(this.storageDataDir, "Local").then((success) => {
                var localFolder = this.storageDataDir + "Local/";
                return this.storageFactory.createFolder(localFolder, channel).then(() => {
                    var channelFolder = localFolder + channel + "/";
                    return this.storageFactory.createFolder(channelFolder, sport).then(() => {
                        var sportFolder = channelFolder + sport + "/";
                        return this.storageFactory.createFolder(sportFolder, typeFolder).then(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            return this.storageFactory.createFolder(contentFolder, matrixName).then((success) => {
                                var fileLocation = contentFolder + matrixName;
                                return this.storageFactory.CreateFile(fileLocation, "Header.xml").then(() => {
                                    return this.storageFactory.WriteFile(fileLocation, "Header.xml", JSON.stringify(content))
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
            this.storageFactory.RemoveFileAsync(headerFolder, DirName).subscribe((res) => {
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
            this.storageFactory.RemoveFileAsync(headerFolder, DirName).subscribe((res) => {
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
            this.storageFactory.createFolder(this.storageDataDir, "Roaming").then((success) => {
                var serverFolder = this.storageDataDir + "Roaming/";
                this.storageFactory.CreateFile(serverFolder, "User.json").then(() => {
                    this.storageFactory.WriteFile(serverFolder, "User.json", JSON.stringify(content))
                        .then(function (success) {
                            this._logger.Debug("registraion complited..");
                        }).catch((err) => { this._logger.Error('Error,saving user async: ', err); })
                }).catch((err) => { this._logger.Error('Error,saving user async: ', err); })
            }).catch((err) => { this._logger.Error('Error,saving user async: ', err); })
        })
    }

    CreateVideoFolder() {
        this.platform.ready().then(() => {
            if (this.platform.is("cordova")) {
                this.storageFactory.createFolder(this.storageRoot, "SportsPIP")
                    .then((success) => {
                        var videoPath = this.storageRoot + "SportsPIP"
                        this.storageFactory.createFolder(videoPath, "Video").then((success) => {
                            this._logger.Debug("video folder created");
                        }).catch((err) => { this._logger.Error('Error,creating video folder: ', err); })
                    })
                    .catch((err) => { this._logger.Error('Error,creating video folder: ', err); });
            }
        })
    }

    CreatePictureFolder() {
        this.platform.ready().then(() => {
            if (this.platform.is("cordova")) {
                this.storageFactory.createFolder(this.storageRoot, "SportsPIP")
                    .then((success) => {
                        var picturePath = this.storageRoot + "SportsPIP"
                        this.storageFactory.createFolder(picturePath, "Picture").then((success) => {
                            this._logger.Debug("Picture folder created");
                        }).catch((err) => { this._logger.Error('Error,creating Picture folder: ', err); })
                    })
                    .catch((err) => { this._logger.Error('Error,creating Picture folder: ', err); });
            }
        })
    }


    GetLocalHeader(): Promise<any> {
        var localMatrices = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Local").then((list) => {
                list.forEach((channelName) => {
                    return this.storageFactory.GetLisOfDirectory(this.storageDataDir + "Local/" + channelName.name + "/Tennis", "Matrices").then((success) => {
                        success.forEach((res) => {
                            return this.ReadMatrixFile(this.storageDataDir + "Local/" + channelName.name + "/Tennis/Matrices/" + res.name, "Header.xml").then((data) => {
                                //deserialiae server header  
                                var result = JSON.parse(data.toString());
                                // console.log(result);
                                var item = this.modelFactory.ComposeHeader(result);
                                localMatrices.unshift(item);
                                return resolve(localMatrices);
                            })
                        })

                    })
                })

            }).catch((err)=>{this._logger.Error('Error,getting local header: ', err);});
        })

    }

    GetServerHeader(): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/").then((success) => {
                success.forEach((channelName) => {
                    return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                        success.forEach((res) => {
                            return this.ReadMatrixFile(this.storageDataDir + "Server/" + channelName.name + "/Tennis/Matrices/" + res.name, "Header.xml")
                                .then(data => {
                                    // deserialiae server header  
                                    var result = JSON.parse(data.toString());
                                    var item = this.modelFactory.ComposeHeader(result);
                                    channels.unshift(item);
                                    resolve(channels);
                                });
                        });
                    });
                })
            }).catch((err)=>{this._logger.Error('Error,getting server header: ', err);});
        })
    }

    GetMatrixListByChannel(channel): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/" + channel + "/Tennis/Matrices/").then((success) => {
                success.forEach((res) => {
                    return this.ReadMatrixFile(this.storageDataDir + "Server/" + channel + "/Tennis/Matrices/" + res.name, "Header.xml")
                        .then(data => {
                            //deserialiae server header  
                            var result = JSON.parse(data.toString());
                            // var result = header.Header;
                            var item = this.modelFactory.ComposeHeader(result);
                            channels.unshift(item);

                            return resolve(channels);
                        });
                });

             }).catch((err)=>{this._logger.Error('Error,getting server header: ', err);});
        })

    }


    ReadMatrixFile(path,fileName){
       return this.storageFactory.ReadFileAync(path,fileName).then((data)=>{
           return data;
       })
    }

    RemoveMatrixFile(path,fileName){
       return this.storageFactory.RemoveFileAsync(path,fileName).toPromise()
    }
}