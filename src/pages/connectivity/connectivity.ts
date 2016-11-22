import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

    isConnectivityEnabled: boolean = true;

    constructor(public navCtrl: NavController,
        private connection: Connection) {

    }

    ionViewDidLoad() {
        console.log('Hello Connectivity Page');
    }

    connectivityChanged(isOn) {
        if (isOn) {
            this.connection.scanUdp();
        }
        else {
            this.connection.close();
        }
    }
    refreshConnection() {
        this.connection.close();
        setTimeout(() => {
            this.connection.scanUdp();
        }, 500);
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

