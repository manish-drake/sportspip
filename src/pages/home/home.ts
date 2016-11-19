import { Component } from '@angular/core';
import {
    NavController, ActionSheetController, AlertController, PopoverController,
    ViewController, ToastController, Platform, LoadingController
} from 'ionic-angular';
import { AppVersion, File } from 'ionic-native';

import { StorageFactory } from '../../Factory/StorageFactory';
import { ModelFactory } from '../../Factory/ModelFactory';
import { Package } from '../../pages/Package';
import { DeleteHeader } from '../../Action/DeleteHeader';
import { OpenMatrix } from '../../Action/OpenMatrix';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';

import { Connectivity } from '../connectivity/connectivity';
import { SettingsPage } from '../settings/settings';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
import { EditorPage } from '../editor/editor';

import { Connection } from '../../pages/Connection';

declare var cordova: any;
declare var navigator: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [StorageFactory, ModelFactory, DeleteHeader, Package, OpenMatrix, DatePipe, Connection]
})

export class HomePage {

    selectedSegment: any = "local";
    localMatrices = [];
    channels = [];
    Header = [];

    constructor(private http: Http, private platform: Platform, public navCtrl: NavController,
        private datepipe: DatePipe,
        private storagefactory: StorageFactory,
        private modelfactory: ModelFactory,
        private deleteHeader: DeleteHeader,
        private openmatrix: OpenMatrix,
        private popoverCtrl: PopoverController,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private packages: Package,
        private loadingCtrl: LoadingController,
        private connection: Connection) {

        //for server url

        // this.GetserverHeader().then(success => {
        //   Observable.interval(1000)
        //     .take(1).map((x) => x + 5)
        //     .subscribe((x) => {
        //       this.SaveServerHeaders();
        //     })
        //      Observable.interval(2000)
        //     .take(1).map((x) => x + 5)
        //     .subscribe((x) => {
        //       this.DisplayServerHeader();
        //     })    
        // });
    }

    ionViewDidEnter() {
        console.log("main page");
        this.localMatrices = [];
        this.channels = [];
        this.DisplayServerHeader();
        this.GetLocalMatrixHeader();
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this.connection.scanUdp();
        });
    }

    openConnectivity() {
        this.navCtrl.push(Connectivity);
    }

    presentPopover(event) {
        let popover = this.popoverCtrl.create(MoreActionsPopover);
        popover.present({ ev: event });
    }

    openSettings() {
        this.navCtrl.push(SettingsPage);
    }

    openCollection() {
        this.navCtrl.push(CollectionPage);
    }


    openChannelCollection(channel) {
        console.log(channel);
        this.navCtrl.push(ChannelCollectionPage, {
            firstPassed: channel
        });
    }

    openMatrix(matrixName, Channel) {
        this.openmatrix.run(matrixName, Channel);
    }

    matrixPressed(index, Name, channel, title) {
        let actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                        this.deleteHeader.DeleteLocalHeader(Name, channel);
                        this.localMatrices.splice(index, 1);
                    }
                }, {
                    text: 'Save Copy',
                    handler: () => {
                        console.log('Copy clicked');
                        this.DuplicateMatrix(channel, Name);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    deleteServerHeader(matrixName, index, value, channel) {
        this.deleteHeader.DeleteServerHeader(matrixName, channel);
        value.splice(index, 1);
        this.channels.splice(index, 1);
    }

    channelMatrixPressed(index, name, value, channel, title) {
        let actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [{
                text: 'Download',
                handler: () => {
                    this.DownloadServerHeaderAsync(name, channel, index, value);
                }
            }, {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    this.deleteServerHeader(name, index, value, channel)
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                handler: () => { }
            }
            ]
        });
        actionSheet.present();
    }

    DuplicateMatrix(channelName, matrixname) {
        var name = Date.now().toString();
        this.platform.ready().then(() => {
            this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices/" + matrixname + "/Header.xml")
                .subscribe(res => {
                    var header = JSON.parse(res.text());
                    header.Name = name;
                    this.storagefactory.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices");
                })
            this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/matrices/" + matrixname + "/" + matrixname + ".mtx")
                .subscribe(res => {
                    var matrix = JSON.parse(res.text());
                    matrix.Matrix._Name = name;
                    this.storagefactory.SaveMatrixAsync(matrix, channelName, matrix.Matrix._Sport, name, "Matrices");
                })
            Observable.interval(1000)
                .take(1).map((x) => x + 5)
                .subscribe((x) => {
                    this.localMatrices = [];
                    this.GetLocalMatrixHeader();
                })
        })
    }

    retrunThumbnailPath(name) {
        return "url(" + cordova.file.applicationStorageDirectory + name + ".jpg" + ")";
    }

    GetLocalMatrixHeader() {
        this.platform.ready().then(() => {
            File.listDir(cordova.file.dataDirectory, "Local/").then((success) => {
                success.forEach((channelName) => {
                    File.listDir(cordova.file.dataDirectory, "Local/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                        success.forEach((res) => {
                            this.http.get(cordova.file.dataDirectory + "Local/" + channelName.name + "/Tennis/Matrices/" + res.name + "/Header.xml")
                                .subscribe(data => {
                                    //deserialiae server header  
                                    var result = JSON.parse(data.text());
                                    // var result = header.Header;
                                    var item = {
                                        Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
                                        ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                                        Views: result.Clips
                                    };
                                    this.localMatrices.push(item);
                                });
                        });
                    });
                })
            });
        });
    }

    FormatDate(value) {
        return this.packages.FormatDate(value);
    }

    formatDuration(dur) {
        return this.packages.FormatDuration(dur);
    }

    //Display Server Header
    DisplayServerHeader() {
        this.platform.ready().then(() => {
            File.listDir(cordova.file.dataDirectory, "Server/").then((success) => {
                success.forEach((channelName) => {
                    File.listDir(cordova.file.dataDirectory, "Server/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                        success.forEach((res) => {
                            this.http.get(cordova.file.dataDirectory + "Server/" + channelName.name + "/Tennis/Matrices/" + res.name + "/Header.xml")
                                .subscribe(data => {
                                    // deserialiae server header  
                                    var result = JSON.parse(data.text());
                                    var item = {
                                        Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
                                        ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                                        Views: result.Clips
                                    };
                                    this.channels.push(item);
                                });
                        });
                    });
                })
            });
        });
    }


    DownloadServerHeaderAsync(fileName, channelName, index, value) {
        let loader = this.loadingCtrl.create({
            content: 'Downloading..',
            duration: 300000
        });
        loader.present();

        var authenticate = this.AuthenticateUser();
        if (authenticate) {

            Observable.interval(1000)
                .take(1).map((x) => x + 5)
                .subscribe((x) => {
                    this.packages.DownloadServerHeader(fileName, channelName);
                    console.log("Download");
                })
            Observable.interval(2000)
                .take(3).map((x) => x + 5)
                .subscribe((x) => {
                    this.packages.unzipPackage();
                    console.log("unzip");
                })

            Observable.interval(4000)
                .take(1).map((x) => x + 5)
                .subscribe((x) => {
                    this.packages.MoveToLocalCollection(channelName);
                    console.log("matrix moved");
                })
        }
        Observable.interval(5000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
                this.localMatrices = [];
                this.GetLocalMatrixHeader();
                console.log("local header");
            })
        Observable.interval(6000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
                this.deleteServerHeader(fileName, index, value, channelName)
                console.log("delete server header");
            })
        Observable.interval(7000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
                this.platform.ready().then(() => {
                    File.removeRecursively(cordova.file.dataDirectory, "Temp").then(() => {
                        console.log("delete temp");
                        loader.dismiss();
                        this.selectedSegment = "local";
                    });
                })
            })
    }

    AuthenticateUser() {
        console.log('Authenticatnig user..');
        return true;
    }

    newMatrix() {
        var data = this.storagefactory.ComposeNewMatrix();
        var result = data.Matrix;
        this.storagefactory.SaveMatrixAsync(data, result.Channel, result._Sport, result._Name, "Matrices");

        var headerContent = this.storagefactory.ComposeMatrixHeader(result);
        this.storagefactory.SaveLocalHeader(headerContent, headerContent.Channel, headerContent.Sport, headerContent.Name, "Matrices")

        this.navCtrl.push(EditorPage, {
            matrixData: result
        });
    }

    // For testing only --starts
    testOpenMatrix() {
        this.http.get("assets/matrix1.mtx")
            .subscribe(data => {
                var res = JSON.parse(data.text());

                if (this.platform.is('cordova')) {
                    File.checkFile(cordova.file.applicationStorageDirectory, 'sample2.mp4').then(_ => {
                        console.log('Sample video already exists');
                        this.testNavToEditor(res);
                    }).catch(err => {

                        File.checkFile(cordova.file.applicationDirectory + '/www/assets/', 'sample2.mp4').then(_ => {

                            File.copyFile(cordova.file.applicationDirectory + '/www/assets/', 'sample2.mp4', cordova.file.applicationStorageDirectory, 'sample2.mp4').then(_ => {
                                console.log('Sample video saved to application directory');
                                this.testNavToEditor(res);
                            }).catch(err => {
                                console.log('Failed saving video' + err);
                                this.testNavToEditor(res);
                            });

                        }).catch(err => {
                            console.log('Sample video not found in assets');
                            this.testNavToEditor(res);
                        });

                    });
                }
                else {
                    this.testNavToEditor(res);
                }

            });

    }

    testNavToEditor(data) {
        this.navCtrl.push(EditorPage, {
            matrixData: data.Matrix
        });
    }
    // For testing only --ends

}

@Component({
    template: `
    <ion-list no-lines>
    <ion-item (click)="onAbout()">
      <ion-icon item-left name="information-circle"></ion-icon>About
      </ion-item>
    </ion-list>
  `
})
export class MoreActionsPopover {

    versionNumber: any;

    constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, private platform: Platform, ) {
        if (this.platform.is('cordova')) {
            AppVersion.getVersionNumber().then((s) => {
                this.versionNumber = s;
            })
        }
    }

    onAbout() {
        this.viewCtrl.dismiss();

        let alert = this.alertCtrl.create({
            title: 'Sports PIP',
            subTitle: 'version ' + this.versionNumber,
            buttons: ['OK']
        });
        alert.present();
    }
}