import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, PopoverController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { File } from 'ionic-native';

import { HomeMorePopover } from '../../pages/homemore-popover/homemore-popover';
import { AlertControllers } from '../../Action/Alerts';
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

import { Logger } from '../../logging/logger';

declare var FileTransfer: any;
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
        private alertCtrls: AlertControllers,
        private toastCtrl: ToastController,
        private packages: Package,
        private loadingCtrl: LoadingController,
        private connection: Connection,
        private _logger: Logger) {

    }

    ionViewDidEnter() {
        this._logger.Debug('Home page loaded');
        console.log("main page");
        this.selectedSegment = "local";
        this.channels = [];
        this.localMatrices = [];
        this.GetServerHeader();
        this.GetLocalMatrixHeader();
    }

    ionViewDidLoad() {
        this.storagefactory.CreateVideoFolder();
        this.connection.scanUdp();
    }

    showSegment(segment) {
        if (segment != this.selectedSegment) {
            this.selectedSegment = segment;
        }
    }

    openConnectivity() {
        this.navCtrl.push(Connectivity);
    }

    presentPopover(event) {
        let popover = this.popoverCtrl.create(HomeMorePopover);
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

    refreshing: boolean = false;

    doRefreshLocal(refresher) {
        this.refreshing = true;
        this.localMatrices = [];

        setTimeout(() => {
            refresher.complete();
            this.GetLocalMatrixHeader();
            this.refreshing = false;
        }, 500);
    }

    doRefreshChannels(refresher) {
        this.refreshing = true;
        this.channels = [];
        setTimeout(() => {
            refresher.complete();
            this.GetServerHeader();
            this.refreshing = false;
        }, 500);
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

    channelMatrixClicked(index, name, value, channel, title) {
        let confirm = this.alertCtrl.create({
            title: ' Download Confirmation?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => { console.log('Cancel clicked'); }
                },
                {
                    text: 'Download',
                    handler: () => {
                        console.log('Download clicked');
                        this.DownloadServerHeaderAsync(name, channel, index, value);
                    }
                }
            ]
        });
        confirm.present();
    }

    channelMatrixPressed(index, name, value, channel, title) {
        let actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [{
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
        var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        this.platform.ready().then(() => {
            this.storagefactory.ReadFileAync("Local", channelName, matrixname, "Header.xml").then((res) => {
                var header = JSON.parse(res.toString());
                header.Name = name;
                header.DateCreated = name;
                this.storagefactory.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices");
            })
            this.storagefactory.ReadFileAync("Local", channelName, matrixname, matrixname + ".mtx").then((res) => {
                var matrix = JSON.parse(res.toString());
                matrix.Matrix._Name = name;
                matrix.Matrix._DateCreated = name;
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
        this._logger.Debug('Getting local matrix header..');
        this.platform.ready().then(() => {
            this.storagefactory.GetLocalHeader().then((res) => {
                this.localMatrices = res;
            }).catch((err) => {
                this._logger.Error('Error,Getting local matrix header..', err);
            });
        });
    }

    FormatDate(value) {
        return this.packages.FormatDate(value);
    }

    // formatDuration(dur) {
    //     console.log(dur);
    //     return this.packages.FormatDuration(dur);
    // }

    //Display Server Header
    GetServerHeader() {
        this._logger.Debug('Getting server matrix header..');
        this.platform.ready().then(() => {
            this.storagefactory.GetServerHeader().then((res) => {
                this.channels = res;
            }).catch((err) => {
                this._logger.Error('Error,Getting server matrix header..', err);
            });
        });
    }

    DownloadServerHeaderAsync(fileName, channelName, index, value) {
        let loader = this.loadingCtrl.create({
            content: 'Downloading..',
            duration: 30000
        });
        loader.present();
        var authenticate = this.AuthenticateUser();
        if (authenticate) {
            this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
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
                Observable.interval(6000)
                    .take(1).map((x) => x + 5)
                    .subscribe((x) => {
                        this.platform.ready().then(() => {
                            this.storagefactory.RemoveFileAsync(cordova.file.dataDirectory, "Temp").then(() => {
                                this.localMatrices = [];
                                this.GetLocalMatrixHeader();
                                this.deleteServerHeader(fileName, index, value, channelName);
                                loader.dismiss();
                            });
                        })
                    })
            });
        }
    }

    AuthenticateUser() {
        console.log('Authenticatnig user..');
        return true;
    }


    newMatrix() {
        this._logger.Debug('Creating new matrix..');
        var data = this.storagefactory.ComposeNewMatrix();
        var result = data.Matrix;

        this.storagefactory.SaveMatrixAsync(data, result._Channel, result._Sport, result._Name, "Matrices");
        var headerContent = this.storagefactory.ComposeNewMatrixHeader(result);
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
                    File.checkFile(cordova.file.externalRootDirectory + "SportsPIP/Video", 'sample.mp4').then(_ => {
                        console.log('Sample video already exists');
                        this.testNavToEditor(res);
                    }).catch(err => {

                        File.checkFile(cordova.file.applicationDirectory + '/www/assets/', 'sample.mp4').then(_ => {

                            File.copyFile(cordova.file.applicationDirectory + '/www/assets/', 'sample.mp4', cordova.file.externalRootDirectory + "SportsPIP/Video", 'sample.mp4').then(_ => {
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