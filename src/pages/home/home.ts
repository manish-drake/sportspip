import { Component } from '@angular/core';
import { NavController, ActionSheetController, AlertController, PopoverController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { File, AppVersion, Device } from 'ionic-native';
import { HomeMorePopover } from '../../pages/homemore-popover/homemore-popover';
import { AlertControllers } from '../../Services/Alerts';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { SettingsPage } from '../settings/settings';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
import { EditorPage } from '../editor/editor';
//Service
import { Storage } from '../../Services/Factory/Storage';
import { Connection } from '../../Services/Connection';
import { Logger } from '../../logging/logger';
import { Connectivity } from '../connectivity/connectivity';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { ModelFactory } from '../../Services/Factory/ModelFactory';
import { Package } from '../../Services/Package';
//Action
import { Duplicate } from '../../Services/Action/Duplicate';
import { DeleteHeader } from '../../Services/Action/DeleteHeader';
import { OpenMatrix } from '../../Services/Action/OpenMatrix';

declare var FileTransfer: any;
declare var navigator: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [ModelFactory, DeleteHeader, Package, OpenMatrix, DatePipe, Connection, Duplicate]
})

export class HomePage {

    selectedSegment: any = "local";
    localMatrices = [];
    channels = [];
    Header = [];
    dataDirectory: any;
    applicationDirectory: any;

    constructor(private http: Http, private platform: Platform, public navCtrl: NavController,
        private duplicate: Duplicate,
        private storage: Storage,
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
        platform.ready().then(() => {
            this.dataDirectory = this.storage.externalDataDirectory();
            this.applicationDirectory = this.storage.applicationDirectory();
        });
    }

    ionViewDidEnter() {
        this._logger.Debug('Home page loaded');
        this.selectedSegment = "local";
        this.channels = [];
        this.localMatrices = [];
        this.GetServerHeader();
        this.GetLocalMatrixHeader();
    }

    ionViewDidLoad() {
        this.logDeviceInfo();
        this.storagefactory.CreateVideoFolder();
        this.storagefactory.CreatePictureFolder();
        this.connection.scanUdp();
    }

    logDeviceInfo() {
        if (this.platform.is('cordova')) {
            AppVersion.getVersionNumber().then((ver) => {
                this._logger.Info('App Version: ', ver);
            });
            this._logger.Info('OS: ', Device.platform + " " + Device.version);
            this._logger.Info('Device: ', Device.manufacturer.toUpperCase() + " " + Device.model);
        }
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


    private _OpenMatrix: OpenMatrix;
    public get OpenMatrix(): OpenMatrix {
        return this.openmatrix;
    }


    // openMatrix(matrixName, Channel) {
    //     this.openmatrix.run(matrixName, Channel);
    // }

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

    matrixPressed(index, matrix) {
        let actionSheet = this.actionSheetCtrl.create({
            title: matrix.Title,
            buttons: [
                {
                    icon: 'trash',
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                        this.deleteHeader.DeleteLocalHeader(matrix.Name, matrix.Channel);
                        this.localMatrices.splice(index, 1);
                    }
                }, {
                    icon: 'copy',
                    text: 'Save Copy',
                    handler: () => {
                        console.log('Copy clicked');
                        this.DuplicateMatrix(matrix.Channel, matrix.Name);
                    }
                }, {
                    icon: 'close',
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
                icon: 'trash',
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    this.deleteServerHeader(name, index, value, channel)
                }
            }, {
                icon: 'close',
                text: 'Cancel',
                role: 'cancel',
                handler: () => { }
            }
            ]
        });
        actionSheet.present();
    }

    DuplicateMatrix(channelName, matrixname) {
        this._logger.Debug('Duplicate  matrix..', );
        this.platform.ready().then(() => {
            this.duplicate.Run(channelName, matrixname).then((res) => {
                this.localMatrices = [];
                this.GetLocalMatrixHeader();
            }).catch((err) => { this._logger.Error('Error,Duplicate  matrix..', err); })
        })

    }

    retrunThumbnailPath(name) {
        return "url(" + this.dataDirectory + name + ".jpg" + ")";
    }

    GetLocalMatrixHeader() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._logger.Debug('Getting local matrix header..');
                this.storagefactory.GetLocalHeader().then((res) => {
                    this.localMatrices=res;
                }).catch((err) => {
                    this._logger.Error('Error,Getting local matrix header..', err);
                });
            }
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
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._logger.Debug('Getting server matrix header..');
                this.storagefactory.GetServerHeader().then((res) => {
                    this.channels = res;
                }).catch((err) => {
                    this._logger.Error('Error,Getting server matrix header..', err);
                });
            }
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
                            this.storagefactory.RemoveFileAsync(this.dataDirectory, "Temp").then(() => {
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
                    File.checkFile(this.dataDirectory + "SportsPIP/Video", 'sample.mp4').then(_ => {
                        console.log('Sample video already exists');
                        this.testNavToEditor(res);
                    }).catch(err => {

                        File.checkFile(this.applicationDirectory + '/www/assets/', 'sample.mp4').then(_ => {

                            File.copyFile(this.applicationDirectory + '/www/assets/', 'sample.mp4', this.dataDirectory + "SportsPIP/Video", 'sample.mp4').then(_ => {
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