import { Injectable } from "@angular/core";
import { ModelFactory } from './Factory/ModelFactory';
import { Platform, ToastController } from 'ionic-angular';
import { Logger } from '../logging/logger';
import { StorageFactory } from './Factory/StorageFactory';
import { Storage } from './Factory/Storage';
import { Observable, Subscription } from 'rxjs/Rx';

@Injectable()
export class Core {
    storageDataDir: string;
    storageRoot: string;
    constructor(private storageFactory: StorageFactory, private modelFactory: ModelFactory,
        private storage: Storage,
        private toastCtrl: ToastController,
        private platform: Platform,
        private _logger: Logger) {

        this.storage.externalDataDirectory().then((res) => {
            this.storageDataDir = res;
        });

    }

    SaveRoamingHeader(content, channel, sport, matrixName) {
        return this.SaveServerHeader(content, channel, sport, matrixName, "Matrices");
    }

    SaveServerHeader(content, channel, sport, matrixName, typeFolder): Promise<any> {
        this._logger.Debug('Save server header..');
        return new Promise((resolve, reject) => {
            return this.storageFactory.createFolder(this.storageDataDir, "Server").subscribe((success) => {
                var serverFolder = this.storageDataDir + "Server/";
                return this.storageFactory.createFolder(serverFolder, channel).subscribe(() => {
                    var channelFolder = serverFolder + channel + "/";
                    return this.storageFactory.createFolder(channelFolder, sport).subscribe(() => {
                        var sportFolder = channelFolder + sport + "/";
                        return this.storageFactory.createFolder(sportFolder, typeFolder).subscribe(() => {
                            var contentFolder = sportFolder + typeFolder + "/";
                            return this.storageFactory.createFolder(contentFolder, matrixName).subscribe((success) => {
                                var fileLocation = contentFolder + matrixName;
                                return this.storageFactory.CreateFile(fileLocation, "Header.xml").subscribe(() => {
                                    return this.storageFactory.WriteFile(fileLocation, "Header.xml", JSON.stringify(content))
                                        .subscribe(function (success) {
                                            console.log("server header saved ..")
                                            return resolve(success);
                                        })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    SaveMatrixAsync(content, channel, sport, matrixName, typeFolder): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                this._logger.Debug('Save matrix async..');
                //create Server Folder
                return this.storageFactory.createFolder(this.storageDataDir, "Local").subscribe((success) => {
                    var localFolder = this.storageDataDir + "Local";
                    return this.storageFactory.createFolder(localFolder, channel).subscribe((success) => {
                        var channelFolder = localFolder + "/" + channel;
                        return this.storageFactory.createFolder(channelFolder, sport).subscribe((success) => {
                            var sportFolder = channelFolder + "/" + sport;
                            return this.storageFactory.createFolder(sportFolder, typeFolder).subscribe((success) => {
                                var contentFolder = sportFolder + "/" + typeFolder;
                                return this.storageFactory.createFolder(contentFolder, matrixName).subscribe((success) => {
                                    var fileLocation = contentFolder + "/" + matrixName;
                                    return this.storageFactory.CreateFile(fileLocation, matrixName + ".mtx").subscribe(() => {
                                        return this.storageFactory.WriteFile(fileLocation, matrixName + ".mtx", JSON.stringify(content)).subscribe((success) => {
                                            return resolve(success);
                                        });
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })

    }

    SaveLocalHeader(content, channel, sport, matrixName, typeFolder): Promise<any> {
        return new Promise((resolve, reject) => {
            this._logger.Debug('Save local header..');
            return this.storageFactory.createFolder(this.storageDataDir, "Local")
                .subscribe((success) => {
                    var localFolder = this.storageDataDir + "Local/";
                    return this.storageFactory.createFolder(localFolder, channel).subscribe((success) => {
                        var channelFolder = localFolder + channel + "/";
                        return this.storageFactory.createFolder(channelFolder, sport).subscribe((success) => {
                            var sportFolder = channelFolder + sport + "/";
                            return this.storageFactory.createFolder(sportFolder, typeFolder).subscribe((success) => {
                                var contentFolder = sportFolder + typeFolder + "/";
                                return this.storageFactory.createFolder(contentFolder, matrixName).subscribe((success) => {
                                    var fileLocation = contentFolder + matrixName;
                                    return this.storageFactory.CreateFile(fileLocation, "Header.xml").subscribe((success) => {
                                        return this.storageFactory.WriteFile(fileLocation, "Header.xml", JSON.stringify(content))
                                            .subscribe((success) => {
                                                return resolve(success);
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
        this._logger.Debug('Deleteing server header..');
        this.platform.ready().then(() => {
            var headerPath = this.storageDataDir + "Server/" + channel + "/Tennis/Matrices/"
            this.RemoveMatrixFile(headerPath, DirName).subscribe((res) => {
                let toast = this.toastCtrl.create({
                    message: 'Deleted Successfully..',
                    duration: 2000,
                });
                toast.present();
            })
        })
    }

    DeleteLocalHeader(DirName, channel) {
        this._logger.Debug('Delete local header..');
        this.platform.ready().then(() => {
            var headerPath = this.storageDataDir + "Local/" + channel + "/Tennis/Matrices";
            this.RemoveMatrixFile(headerPath, DirName).subscribe((res) => {
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
            this.storageFactory.createFolder(this.storageDataDir, "Roaming")
                .catch(err => new Observable(err => { return this._logger.Error('Error,saving user async: ', err); }))
                .subscribe((success) => {
                    var serverFolder = this.storageDataDir + "Roaming/";
                    this.storageFactory.CreateFile(serverFolder, "User.json").subscribe(() => {
                        this.storageFactory.WriteFile(serverFolder, "User.json", JSON.stringify(content))
                            .subscribe(function (success) {
                                this._logger.Debug("registraion complited..");
                            })
                    })
                })
        })
    }

    CreateResourceDirectories() {
        this.storage.externalRootDirectory().then((res1) => {
            this.storageRoot = res1;
            this.storageFactory.createFolder(this.storageRoot, "SportsPIP")
                .subscribe((success) => {
                    this._logger.Debug("SportsPIP folder created");
                    this.CreateVideoFolder();
                    this.CreatePictureFolder();
                });
        });
    }

    CreateVideoFolder() {
        var Path = this.storageRoot + "SportsPIP"
        this.storageFactory.createFolder(Path, "Video")
            .catch((err) => new Observable(err => { this._logger.Error('Error,creating video folder: ', err) }))
            .subscribe((success) => {
                this._logger.Debug("video folder created");
            })
    }

    CreatePictureFolder() {
        var Path = this.storageRoot + "SportsPIP"
        this.storageFactory.createFolder(Path, "Picture")
            .catch((err) => new Observable(err => { this._logger.Error('Error,creating Picture folder: ', err) }))
            .subscribe((success) => {
                this._logger.Debug("Picture folder created");
            })
    }


    GetLocalHeader(): Promise<any> {
        this._logger.Debug("Getting local header");
        var localMatrices = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Local").then((list) => {
                list.forEach((channelName) => {
                    return this.storageFactory.GetLisOfDirectory(this.storageDataDir + "Local/" + channelName.name + "/Tennis", "Matrices").then((success) => {
                        success.forEach((res) => {
                            return this.ReadMatrixFile(this.storageDataDir + "Local/" + channelName.name + "/Tennis/Matrices/" + res.name, "Header.xml")
                                .subscribe((data) => {
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
            }).catch((err) => { this._logger.Error('Error,getting local header: ', err); });
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
                                .subscribe(data => {
                                    // deserialiae server header  
                                    var result = JSON.parse(data.toString());
                                    var item = this.modelFactory.ComposeHeader(result);
                                    channels.unshift(item);
                                    resolve(channels);
                                });
                        });
                    })
                })
            }).catch((err) => { this._logger.Error('Error,getting server header: ', err); });
        })
    }

    GetMatrixListByChannel(channel): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/" + channel + "/Tennis/Matrices/").then((success) => {
                success.forEach((res) => {
                    return this.ReadMatrixFile(this.storageDataDir + "Server/" + channel + "/Tennis/Matrices/" + res.name, "Header.xml")
                        .subscribe(data => {
                            //deserialiae server header  
                            var result = JSON.parse(data.toString());
                            // var result = header.Header;
                            var item = this.modelFactory.ComposeHeader(result);
                            channels.unshift(item);
                            return resolve(channels);
                        });
                });
            }).catch((err) => { this._logger.Error('Error,getting server header in channel collection page: ', err); });
        })
    }


    ReadMatrixFile(path, fileName): Observable<any> {
        return this.storageFactory.ReadFileAync(path, fileName).map((data) => {
            return data;
        }).catch((err) => {
            return err;
        })
    }

    RemoveMatrixFile(path: string, fileName: string): Observable<any> {
        return this.storageFactory.RemoveFileAsync(path, fileName).map((data) => {
            return data;
        }).catch((err) => {
            console.log(err);
            return err;
        })
    }


}