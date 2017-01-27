import { Component, DoCheck } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';

import { Connection } from '../../Services/Connection';
import { Logger } from '../../logging/logger';
import { Alert } from '../../Services/common/alerts';

declare var chrome: any;

@Component({
    selector: 'page-connectivity',
    templateUrl: 'connectivity.html',
    providers: [Connection]
})

export class Connectivity implements DoCheck {

    servers = Connection.servers;
    isConnectivityEnabled: boolean = true;
    isLoading: boolean;

    constructor(public navCtrl: NavController,
        private connection: Connection,
        private toastCtrl: ToastController,
        private _logger: Logger,
        private alertCtrls: Alert) {

    }

    ngDoCheck() {
        setTimeout(() => {
            if (this.servers.length == 0) {
                this.servers = Connection.servers;
            }
            else {
                this.isLoading = false;
            }
        }, 1000);
    }

    ionViewDidLoad() {
        console.log('Hello Connectivity Page');
        this.reloadConnections();
    }

    reloadConnections() {
        this.showLoader();
        this.connection.close();
        this.connection.scanUdp();
    }

    showLoader() {
        if (this.isConnectivityEnabled) {
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
            }, 10000);
        }
    }

    refreshing: boolean = false;

    doRefresh(refresher) {
        this._logger.Debug('Refresh connectivity content..');
        try {
            this.refreshing = true;
            this.servers.length == 0
            setTimeout(() => {
                refresher.complete();
                this.refreshing = false;
                this.reloadConnections();
            }, 500);
        }
        catch (err) {
            this._logger.Error('Error,refreshing connectivity content: ', err);
        }
    }

    connectivityChanged(isOn) {
        this._logger.Debug('Connectivity changed..', isOn);
        try {
            if (isOn) {
                this.showLoader();
                this.connection.scanUdp();
                let toast = this.toastCtrl.create({
                    message: 'Connectivity is now on.',
                    duration: 1500,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                });
                toast.present(toast);
            }
            else {
                this.servers.length == 0;
                this.isLoading = false;
                this.connection.close();
                let toast = this.toastCtrl.create({
                    message: 'Connectivity closed.',
                    duration: 1500,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'Ok'
                });
                toast.present(toast);
            }
        }
        catch (error) {
            this._logger.Error('Error,changing connectivity : ', error);
        }
    }

    openConfig() {
        this._logger.Debug('Connection config alert prompt opened');
        this.alertCtrls.PromptAlert("Listens on port", "", "port", "Port eg. 5333", Connection.port)
            .then(data => {
                Connection.port = (<any>data).port;
                this.connection.setPort((<any>data).port);
                this.reloadConnections();
            })
    }

    connect(server) {
        this.connection.connect(server);
    }

    disconnect(server) {
        this.connection.disconnect(server);
    }

    forget(server) {
        this.connection.forget(server);
    }

    getStatusColor(status) {
        if (status == "Ready to Pair") {
            return 'orange';
        }
        if (status == "Available") {
            return 'green';
        }
        if (status == "Connected") {
            return '#387ef5';
        }
        if (status == "Unavailable") {
            return 'gray';
        }
    }
}

