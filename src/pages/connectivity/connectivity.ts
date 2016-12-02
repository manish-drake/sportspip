import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { Connection } from '../../pages/Connection';

/*
  Generated class for the Connectivity page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var chrome: any;



@Component({
    selector: 'page-connectivity',
    templateUrl: 'connectivity.html',
    providers: [Connection]
})


export class Connectivity {
    servers = Connection.servers;

    isConnectivityEnabled: boolean;

    constructor(public navCtrl: NavController,
        private connection: Connection,
        private toastCtrl: ToastController) {

    }

    ionViewDidLoad() {
        console.log('Hello Connectivity Page');
        this.isConnectivityEnabled = true;
    }

    connectivityChanged(isOn) {
        if (isOn) {
            this.connection.scanUdp();
            let toast = this.toastCtrl.create({
                message: 'Connectivity is now on.',
                duration: 2000,
                position: 'top'
            });
            toast.present(toast);
        }
        else {
            this.connection.close();
            let toast = this.toastCtrl.create({
                message: 'Connectivity closed.',
                duration: 2000,
                position: 'top'
            });
            toast.present(toast);
        }
    }
    refreshConnection() {
        this.connection.close();

        let toast = this.toastCtrl.create({
            message: 'Connections reloaded.',
            duration: 2000,
            position: 'top'
        });
        toast.present(toast);

        this.connection.scanUdp();
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

