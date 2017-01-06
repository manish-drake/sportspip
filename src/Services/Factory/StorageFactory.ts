import { Injectable } from "@angular/core";
import { Platform, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from './Storage';
import { File, WriteOptions, DirectoryEntry } from 'ionic-native';
import { Logger } from '../../logging/logger';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()
export class StorageFactory {

    private storageRoot: string;
    private storageDataDir: string;

    constructor(private http: Http,
        private storage: Storage,
        private platform: Platform,
        private toastCtrl: ToastController,
        private _logger: Logger) {
        platform.ready().then(() => {
            this.storageDataDir = this.storage.externalDataDirectory();
            this.storageRoot = this.storage.externalRootDirectory();
        });
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
                                    this.WriteFile(fileLocation, "Header.xml",JSON.stringify(content))
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

    SaveMatrixAsync(content, channel, sport, matrixName, typeFolder):Promise<any> {
        if (this.platform.is('cordova')) {
            this._logger.Debug('Save matrix async..');
            //create Server Folder
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
                                return this.CreateFile(fileLocation, matrixName + ".mtx").then(() => {
                                    return this.WriteFile(fileLocation, matrixName + ".mtx", JSON.stringify(content))
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
                                    this.WriteFile(fileLocation, "Header.xml", JSON.stringify(content))
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
            this.RemoveFileAsync(headerFolder, DirName).subscribe((res) => {
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
            this.RemoveFileAsync(headerFolder, DirName).subscribe((res) => {
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
            this.createFolder(this.storageDataDir, "Roaming").then((success) => {
                var serverFolder = this.storageDataDir + "Roaming/";
                this.CreateFile(serverFolder, "User.json").then(() => {
                    this.WriteFile(serverFolder, "User.json", JSON.stringify(content))
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
                this.createFolder(this.storageRoot, "SportsPIP")
                    .then((success) => {
                        var videoPath = this.storageRoot + "SportsPIP"
                        this.createFolder(videoPath, "Video").then((success) => {
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
                this.createFolder(this.storageRoot, "SportsPIP")
                    .then((success) => {
                        var picturePath = this.storageRoot + "SportsPIP"
                        this.createFolder(picturePath, "Picture").then((success) => {
                            this._logger.Debug("Picture folder created");
                        }).catch((err) => { this._logger.Error('Error,creating Picture folder: ', err); })
                    })
                    .catch((err) => { this._logger.Error('Error,creating Picture folder: ', err); });
            }
        })
    }

    CheckFile(dirpath, fileName): Promise<any> {
        return File.checkFile(dirpath, fileName);
    }



    createFolder(path: string, dirName: string): Promise<any> {
        return File.createDir(path, dirName, true).then((success) => {
            return success
        });
    }


    CreateFile(path, fileName): Promise<any> {
        return File.createFile(path, fileName, true);
    }

    writeOptions: WriteOptions = { replace: true }

    WriteFile(path, fileName, content): Promise<any> {
        return File.writeFile(path, fileName, content, this.writeOptions);
    }

    CopyFile(oldPath, oldName, newPath, fileName): Promise<any> {
        return File.copyFile(oldPath, oldName, newPath, fileName);
    }

    MoveFile(oldPath, newPath, fileName): Observable<string> {
        return Observable.fromPromise(File.moveFile(oldPath, fileName, newPath, fileName))
            .map(x => x["nativeUrl"]);
    }

    RemoveFile(path, fileName): Promise<any> {
        return File.removeFile(path, fileName);
    }

    RemoveFileAsync(path, dirName): Observable<boolean> {
        return Observable.fromPromise(File.removeRecursively(path, dirName))
            .map(x => x.success);
    }

    ReadMatixFileAync(dirName, channelName, matrixname, fileName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(this.storageDataDir + dirName + "/" + channelName + "/Tennis/Matrices/" + matrixname, fileName);
    }

    GetLisOfDirectory(path, DirName) {
        return File.listDir(path, DirName).then((success) => {
            return success;
        })
    }

    ReadFileAync(path, dirName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(path, dirName);
    }

  
}