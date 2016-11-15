import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Connectivity page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-connectivity',
    templateUrl: 'connectivity.html'
})
export class Connectivity {

    isConnectivityEnabled: boolean = true;

    connections = [
        { title: 'Server 1', status: 'Ready to Pair', ipaddress: '192.168.1.267', description: 'Sports PIP Server', connected: false, saved: false, available: true },
        { title: 'Server 2', status: 'Ready to Pair', ipaddress: '192.168.1.268', description: 'Sports PIP Server', connected: false, saved: false, available: true },
        { title: 'Server 3', status: 'Ready to Pair', ipaddress: '192.168.1.269', description: 'Sports PIP Server', connected: false, saved: false, available: true },
        { title: 'Server 4', status: 'Unavailable', ipaddress: '192.168.1.270', description: 'Sports PIP Server', connected: false, saved: true, available: false }
    ];

    constructor(public navCtrl: NavController) { }

    ionViewDidLoad() {
        console.log('Hello Connectivity Page');
    }

    connect(conn) {
        this.connections.forEach((connection, index) => {
            if (conn == connection) {
                connection.connected = true;
                connection.status = 'Connected';
                connection.saved = true;
            }
            else {
                connection.connected = false;
                if (connection.saved == true) {
                    connection.status = 'Available';
                }
                else {
                    connection.status = 'Ready to Pair';
                }
            }
        });
    }

    disconnect(conn) {
        this.connections.forEach(connection => {
            console.log(conn);
            console.log(connection);
            if (conn == connection) {
                connection.connected = false;
                connection.status = 'Available';
            }
        });
    }

    forget(conn) {
        this.connections.forEach((connection, index) => {
            if (conn == connection) {
                if (connection.available) {
                    connection.connected = false;
                    connection.status = 'Ready to Pair';
                    connection.saved = false;
                }
                else {
                    this.connections.splice(index, 1);
                }
            }
        });
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

