import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Zip } from '@ionic-native/zip';
import { StorageFactory } from './Factory/StorageFactory';
import { Core } from './core';
import { Storage } from './Factory/Storage';
import { HttpService } from './httpService';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import X2JS from 'x2js';
import * as JSZip from 'jszip';

declare var FileTransfer: any;

@Injectable()
export class Package {

    private storageDataDir: string;
    private storageRootDirectory: string;
    constructor(private httpService: HttpService,
        private storage: Storage,
        private core: Core,
        private platform: Platform,
        private zip: Zip,
        private storagefactory: StorageFactory) {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this.storage.externalDataDirectory().then((res) => {
                    this.storageDataDir = res;
                    this.storage.externalRootDirectory().then((res1) => {
                        this.storageRootDirectory = res1;
                    });
                });
            }
        });
    }

    public fileName: any;
    public channelName: any;

    CreatePackage(channel: any, matrixName: any): Promise<any> {
        console.log("CreatePackage() called..");
        console.log("Channel: " + channel);
        console.log("Matrix Name: " + matrixName);

        return new Promise((resolve, reject) => {

            var chkPromise = new Promise((resolve, reject) => {
                this.storagefactory.CheckFolder(this.storageDataDir, 'Temp').subscribe((res) => {
                    if (res) {
                        console.log("Pre-existing Temp folder found")
                        this.storagefactory.RemoveFileAsync(this.storageDataDir, 'Temp').subscribe(() => {
                            console.log("Removed existing Temp folder data")
                            return resolve();
                        }, (error) => {
                            console.log("Error removing existing Temp folder data: " + JSON.stringify(error));
                            return reject();
                        });
                    }
                    else {
                        console.log("No pre-existing Temp folder exists")
                        return resolve()
                    }
                }, (error) => {
                    console.log("No pre-existing Temp folder exists")
                    return resolve()
                })
            })
            chkPromise.then(() => {
                console.log("Temp folder is empty");
                console.log("Initialized zipPackage");
                this.storagefactory.createFolder(this.storageDataDir, "Temp").subscribe((success) => {
                    console.log("Success creating Temp folder")
                    var tempPath = this.storageDataDir + "Temp/";
                    this.storagefactory.createFolder(tempPath, "matrix" + matrixName).subscribe((success) => {
                        console.log("Success creating Temp Matrix folder")
                        var tempMatrixPath = tempPath + "matrix" + matrixName;
                        var matrixPath = this.storageDataDir + "Local/" + channel + "/Tennis/Matrices/" + matrixName;
                        this.AddMatrixToPackage(matrixPath, matrixName, tempMatrixPath).then(() => {
                            this.AddVideosToPackage(matrixPath, matrixName, tempMatrixPath).then(() => {
                                this.zipPackage(tempPath, matrixName).then((res) => {
                                    return resolve(res);
                                }).catch((error) => {
                                    return reject(error);
                                });
                            }).catch((err) => {
                                return reject(err);
                            });
                        }).catch(() => {
                            return reject()
                        });
                    }, (error) => {
                        console.log("Error creating Temp Matrix folder: " + JSON.stringify(error));
                        return reject();
                    });
                }, (error) => {
                    console.log("Error creating Temp folder: " + JSON.stringify(error));
                    return reject();
                });

            }).catch(() => {
                return reject();
            })
        });
    }

    AddMatrixToPackage(matrixPath: any, matrixName: any, tempMatrixPath: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storagefactory.ReadFileAync(matrixPath, matrixName + ".mtx").subscribe((data) => {
                console.log("Success reading json matrix file");
                let parser: any = new X2JS();
                var xmlData = parser.js2xml(JSON.parse(data));
                this.storagefactory.WriteFile(tempMatrixPath, matrixName + ".mtx", xmlData).subscribe((res) => {
                    console.log("Success creating xml matrix file" + JSON.stringify(res));
                    return resolve();
                }, (error) => {
                    console.log("Error creating xml matrix file !!" + JSON.stringify(error));
                    return reject();
                });
            }, (error) => {
                console.log("Error reading json matrix file !!" + JSON.stringify(error));
                return reject();
            });
        });
    }

    AddVideosToPackage(matrixPath: any, matrixName: any, tempMatrixPath: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.core.ReadMatrixFile(matrixPath, matrixName + ".mtx")
                .subscribe((data) => {
                    var res = JSON.parse(data.toString());
                    var matrix = res.Matrix;
                    var views = matrix['Matrix.Children'].View;
                    var fileKernels: any = []
                    var resPromise = new Promise((resolve, reject) => {
                        views.forEach((view, index, array) => {
                            if (view.Content !== undefined) {
                                if (view.Content.Capture != undefined) {
                                    var videoFileName = view.Content.Capture._Kernel as string;
                                    fileKernels.push(videoFileName);
                                    let videosPath = this.storageRootDirectory + "SportsPIP/Video";
                                    this.storagefactory.CopyFile(videosPath, videoFileName, tempMatrixPath, videoFileName).subscribe((res) => {
                                        console.log("Success copying video fle: " + videoFileName);
                                        if (index === array.length - 1) resolve();
                                    }, (error) => {
                                        console.log("Error copying video file: " + JSON.stringify(error));
                                        return reject()
                                    });

                                }
                                else {
                                    console.log("view.Content.Capture undefined")
                                    return reject("Matrix have no content in views.");
                                }
                            }
                            else {
                                console.log("view.Content undefined")
                                return reject();
                            }
                        });
                    });
                    resPromise.then(() => {
                        console.log("Videos added successfully.");
                        this.core.SavePackageHeader(tempMatrixPath, matrixName + ".mtx", fileKernels)
                        .then((res) => {
                            return resolve();
                        })
                        .catch((err) => {
                            return reject();
                        });
                    }).catch(() => {
                        return reject();
                    })
                }, (error) => {
                    console.log("Error, reading matrix file: " + JSON.stringify(error));
                });
        });
    }

    zipPackage(tempPath: any, matrixName: any): Promise<any> {
        console.log('zipPackage() called');
        var tempMatrixPath = tempPath + "matrix" + matrixName;
        return new Promise((resolve, reject) => {
            var jszip = new JSZip();
            this.storagefactory.GetLisOfDirectory(tempPath, 'matrix' + matrixName).then((files) => {
                var resPromise = new Promise((resolve, reject) => {
                    files.forEach((file, index, array) => {
                        this.storagefactory.ReadFileBufferAync(tempMatrixPath, file.name).subscribe((data) => {
                            console.log("Got file data to include in zip: " + file.name)
                            jszip.file(file.name, data);
                            console.log(":: file; index: " + index + " ; array.length: " + array.length )
                            if (index === array.length - 1) {
                                console.log("Waiting..");
                                setTimeout(() => {
                                    console.log("Wait end");
                                    resolve();
                                }, 6000);
                            }
                        }, (error) => {
                            console.log("Error reading file: " + JSON.stringify(error));
                            reject()
                        });
                    });
                });
                resPromise.then(() => {
                    console.log("Files added to zip utility");
                    jszip.generateAsync({ type: "blob" }).then((content) => {
                        console.log("Zip content generated");
                        console.log("Content size: " + content.size);
                        this.storagefactory.WriteFile(tempPath, matrixName + ".sar", content).subscribe((data) => {
                            console.log("Zip file created: " + JSON.stringify(data))
                            return resolve();
                        }, (error) => {
                            console.log("Error saving zip file: " + JSON.stringify(error))
                            return reject();
                        });
                    }).catch(function (error) {
                        console.log("Error generating zip content: " + JSON.stringify(error));
                        return reject();
                    });
                }).catch(() => {
                    return reject();
                })
            }).catch((error) => {
                console.log("Error getting files from directory: " + JSON.stringify(error))
                return reject();
            });
        });
    }

    MoveToLocalCollection(channelName) {
        this.fileName = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        return this.storagefactory.ReadFileAync(this.storageDataDir + "Temp/matrix1", "Header.xml").map((result => {
            console.log("header moving..");
            var header = JSON.parse(result.toString());
            header.Name = this.fileName;
            header.DateCreated = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
            header.ThumbnailSource = header.UploadID;
            this.channelName = header.Channel;
            return this.core.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices").then((res) => {
                console.log("header moved");
                return this.storagefactory.GetLisOfDirectory(this.storageDataDir + "Temp", "matrix1").then((success) => {
                    return success.forEach(file => {
                        var sliced = file.name.substr(-4);
                        switch (sliced) {
                            case '.mtx':
                                let parser: any = new X2JS();
                                return this.storagefactory.ReadFileAync(this.storageDataDir + "Temp/matrix1", file.name).subscribe(data => {
                                    console.log("mtx moving...");
                                    var matrixdata = parser.xml2js(data.toString());
                                    var matrix = matrixdata.Matrix;
                                    matrix._Name = this.fileName;
                                    matrix._Channel = this.channelName;
                                    return this.core.SaveMatrixAsync(matrixdata, matrix._Channel, matrix._Sport, matrix._Name, "Matrices").then((res) => {
                                        console.log("mtx moved...");
                                        file.remove(() => {
                                            return res;
                                        });
                                    });
                                })
                            case '.mp4':
                                return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", file.name, this.storageRootDirectory + "SportsPIP/Video", file.name)
                                    .subscribe((success) => {
                                        console.log("video moved");
                                        file.remove(() => {
                                            return success;
                                        });
                                    });
                            case ".gif":
                            case ".rtf":
                            case ".jpg":
                                return this.storagefactory.MoveFile(this.storageDataDir + "Temp/matrix1", file.name, this.storageRootDirectory + "SportsPIP/Picture", file.name)
                                    .subscribe((success) => {
                                        console.log("images or ink or gif moved...");
                                        file.remove(() => {
                                            return success;
                                        });
                                    });
                            default:
                        }
                    });
                })
            });

        }));
    }

    DownloadServerHeader(fileName, channelName): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.storagefactory.createFolder(this.storageDataDir, "Temp").subscribe(() => {
                var NewPath = this.storageDataDir + "Temp/";
                return this.storagefactory.createFolder(NewPath, "matrix1").subscribe(() => {
                    var matrixPath = NewPath + "matrix1/";
                    var oldPath = this.storageDataDir + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
                    return this.storagefactory.CopyFile(oldPath, "Header.xml", matrixPath, "Header.xml").subscribe((success) => {
                        const ft = new FileTransfer();
                        var url = encodeURI("https://sportspipstorage.blob.core.windows.net/matrices/" + channelName + "/" + fileName + ".sar");
                        // var url = encodeURI("https://drake.blob.core.windows.net/matrices/Harvest/636049183928404138.sar");
                        ft.download(url, NewPath + "m1.zip",
                            function (entry) {
                                console.log("download complete: " + entry.toURL());
                                resolve(true);
                            },
                            function (error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("download error code" + error.code);
                                reject(error);
                            },
                            true);
                    })
                })
            })
        })
    }

    AuthenticateUser(channel, userid) {
        return this.httpService.GetFileFromServer("http://sportspipservice.cloudapp.net:10106/IMobile/users/auth/" + channel + "?uid=" + userid)
            .then(us => {
                console.log('Authenticatnig user...');
                var data = JSON.parse(us);
                return data.Returns;
            })
    }

    unzipPackage() {
        var PathToFileInString = this.storageDataDir + "Temp/m1.zip";
        var PathToResultZip = this.storageDataDir + "Temp/matrix1";
        return this.zip.unzip(PathToFileInString, PathToResultZip, (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
            .then((res) => {
                console.log("Unzipping....")
                return res;
            })
    }

    DownloadThumbnailfromServer(channelName, matrixName) {
        const ft = new FileTransfer();
        var url = encodeURI("https://sportspipstorage.blob.core.windows.net/thumbnails/" + channelName + "/" + matrixName + ".jpg");
        ft.download(
            url,
            this.storageDataDir + matrixName + ".jpg",
            function (entry) {
                console.log("download complete: " + entry.toURL());
            },
            function (error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
            true);
    }
}