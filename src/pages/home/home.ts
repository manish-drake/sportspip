import { Component } from '@angular/core';
import { NavController, ActionSheetController, PopoverController, Platform, LoadingController } from 'ionic-angular';
import { AppVersion, Device } from 'ionic-native';
import { HomeMorePopover } from '../../pages/homemore-popover/homemore-popover';
import { Alert } from '../../Services/common/alerts';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { AccountPage } from '../account/account';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
import { EditorPage } from '../editor/editor';
import { SettingsPage } from '../settings/settings';
//Service
import { Storage } from '../../Services/Factory/Storage';
import { Connection } from '../../Services/Connection';
import { Logger } from '../../logging/logger';
import { Connectivity } from '../connectivity/connectivity';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { ModelFactory } from '../../Services/Factory/ModelFactory';
import { Package } from '../../Services/Package';
import { Core } from '../../Services/core';
import { Utils } from '../../Services/common/utils';
import { HttpService } from '../../Services/httpService';
//Action
import { Duplicate } from '../../Services/Action/Duplicate';
import { DeleteHeader } from '../../Services/Action/DeleteHeader';
import { OpenMatrix } from '../../Services/Action/OpenMatrix';
import { Download } from '../../Services/Action/Download';
import { AddNewMatrix } from '../home/action/addNewMatrix';

declare var FileTransfer: any;
declare var navigator: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [ModelFactory, DeleteHeader, Package, OpenMatrix, Connection, Duplicate, Download, AddNewMatrix]
})

export class HomePage {

    selectedSegment: any = "local";
    localMatrices = [];
    channels = [];
    Header = [];
    dataDirectory: any;

    constructor(private platform: Platform, public navCtrl: NavController,
        private core: Core,
        private addNewMatrix: AddNewMatrix,
        private duplicate: Duplicate,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private download: Download,
        private modelfactory: ModelFactory,
        private deleteHeader: DeleteHeader,
        private openmatrix: OpenMatrix,
        private popoverCtrl: PopoverController,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrls: Alert,
        private packages: Package,
        private loadingCtrl: LoadingController,
        private connection: Connection,
        private httpService: HttpService,
        private _logger: Logger) {

        this.storage.externalDataDirectory().then((res) => {
            this.dataDirectory = res;
        });
    }

    ionViewDidEnter() {
        this._logger.Debug('Home page loaded');
        this.selectedSegment = "local";
        this.channels = [];
        this.localMatrices = [];
        this.platform.ready().then(() => {
            this.GetServerHeader();
            this.GetLocalMatrixHeader();
        })
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this.logDeviceInfo();
            this.core.CreateResourceDirectories();
            this.connection.scanUdp();
        });
    }

    logDeviceInfo() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                AppVersion.getVersionNumber().then((ver) => {
                    this._logger.Info('App Version: ', ver);
                });
                this._logger.Info('OS: ', Device.platform + " " + Device.version);
                this._logger.Info('Device: ', Device.manufacturer.toUpperCase() + " " + Device.model);
            }
        });
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

        popover.onWillDismiss((res)=>{
            if(res == "openSettings"){
                this.navCtrl.push(SettingsPage);
            }
        })
    }

    openAccounts() {
        this.navCtrl.push(AccountPage);
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

    channelMatrixPressed(index, matrix, value) {
        let actionSheet = this.actionSheetCtrl.create({
            title: matrix.Title,
            buttons: [{
                icon: 'trash',
                text: 'Delete',
                role: 'destructive',
                handler: () => { this.deleteServerHeader(matrix.Name, index, value, matrix.Channel) }
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
            this.duplicate.Run(channelName, matrixname)
                .catch(err => new Observable(err => { this._logger.Error('Error,Duplicate  matrix..', err); }))
                .then((res) => {
                    this.localMatrices = [];
                    this.GetLocalMatrixHeader();
                })
        })
    }

    retrunThumbnailPath(name) {
        return "url(" + this.dataDirectory + name + ".jpg" + ")";
    }

    GetLocalMatrixHeader() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._logger.Debug('Getting local matrix header..');
                this.core.GetLocalHeader()
                    .then((res) => {
                        this.localMatrices = res;
                    })
                    .catch((err) => {
                        this._logger.Error('Error,Getting local matrix header..', err);
                    });
            }
        });
    }

    FormatDate(value) {
        return Utils.FormatDate(value);
    }

    //Display Server Header
    GetServerHeader() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._logger.Debug('Getting server matrix header..');
                this.core.GetServerHeader()
                    .then((res) => {
                        this.channels = res;
                    })
                    .catch((err) => {
                        this._logger.Error('Error,Getting server matrix header..', err);
                    });
            }
        });
    }

    channelMatrixClicked(index, matrix, value) {
        this.alertCtrls.ConfirmationAlert("Download Confirmation?", null, "Download").then((res) => {
            if (res.toString() == "Download") {
                let loader = this.loadingCtrl.create({
                    content: 'Downloading..',
                    duration: 30000
                });
                loader.present();

                this.download.DownloadServerHeaderAsync(matrix.Name, matrix.Channel, this.dataDirectory).then((res) => {
                    this.localMatrices = [];
                    this.GetLocalMatrixHeader();
                    this.deleteServerHeader(matrix.Name, index, value, matrix.Channel);
                    loader.dismiss();

                }).catch((err) => {
                    this._logger.Error('Error,downloading server header async: ', err);
                });
            }
        })
    }

    // DownloadServerHeaderAsync(fileName, channelName, index, value) {
    //     var authenticate = this.AuthenticateUser();
    //     if (authenticate) {
    //         this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
    //             Observable.interval(2000)
    //                 .take(3).map((x) => x + 5)
    //                 .subscribe((x) => {
    //                     this.packages.unzipPackage();
    //                     console.log("unzip");
    //                 })
    //             Observable.interval(4000)
    //                 .take(1).map((x) => x + 5)
    //                 .subscribe((x) => {
    //                     this.packages.MoveToLocalCollection(channelName);
    //                 })
    //             Observable.interval(6000)
    //                 .take(1).map((x) => x + 5)
    //                 .subscribe((x) => {
    //                     this.platform.ready().then(() => {
    //                         this.core.RemoveMatrixFile(this.dataDirectory, "Temp").subscribe((res) => {
    //                             this.localMatrices = [];
    //                             this.GetLocalMatrixHeader();
    //                             this.deleteServerHeader(fileName, index, value, channelName);
    //                             loader.dismiss();
    //                         });
    //                     })
    //                 })
    //         });
    //     }
    // }

    // AuthenticateUser() {
    //     console.log('Authenticatnig user..');
    //     return true;
    // }

    private _newMatrix: AddNewMatrix;
    public get newMatrix(): AddNewMatrix {
        return this.addNewMatrix;
    }
    // For testing only --starts
    testOpenMatrix() {
        this.httpService.GetFileFromServer("assets/matrix1.mtx")
            .then(res => {
                this.testNavToEditor(res);
            });

    }

    testNavToEditor(data) {
        this.navCtrl.push(EditorPage, {
            matrixData: data.Matrix
        });
    }
    // For testing only --ends

}