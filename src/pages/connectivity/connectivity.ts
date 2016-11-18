import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { } from 'ionic-native';

import X2JS from 'x2js';

/*
  Generated class for the Connectivity page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var chrome: any;

@Component({
    selector: 'page-connectivity',
    templateUrl: 'connectivity.html'
})


export class Connectivity {

    isConnectivityEnabled: boolean = true;

    // connections = [
    //     { title: 'Server 1', status: 'Ready to Pair', ipaddress: '192.168.1.267', description: 'Sports PIP Server', connected: false, saved: false, available: true },
    //     { title: 'Server 2', status: 'Ready to Pair', ipaddress: '192.168.1.268', description: 'Sports PIP Server', connected: false, saved: false, available: true },
    //     { title: 'Server 3', status: 'Ready to Pair', ipaddress: '192.168.1.269', description: 'Sports PIP Server', connected: false, saved: false, available: true },
    //     { title: 'Server 4', status: 'Unavailable', ipaddress: '192.168.1.270', description: 'Sports PIP Server', connected: false, saved: true, available: false }
    // ];

    constructor(public navCtrl: NavController) { }

    ionViewDidLoad() {
        console.log('Hello Connectivity Page');
        this.scanUdp();
    }

    servers = [];

    scanUdp() {
        var onReceive = function (info) {
            var binaryData = (info.data);
            var dataStr = '';
            var ui8 = new Uint8Array(binaryData);
            for (var i = 0; i < ui8.length; i++) {
                dataStr = dataStr + String.fromCharCode(ui8[i]);
            }

            let parser: any = new X2JS();
            var data = parser.xml2js(dataStr);
            // alert( JSON.stringify(data.Server));
            var server = JSON.stringify(data.Server);
            this.servers.push({server});
            alert(this.servers);
        }
        var onReceiveError = function (errorinfo) {
            console.log('onReceiveError:');
            console.log(errorinfo);
            alert('onReceiveError:' + errorinfo);
        }
        chrome.sockets.udp.create({}, function (createInfo) {
            var socketId = createInfo.socketId;
            chrome.sockets.udp.onReceive.addListener(onReceive);
            chrome.sockets.udp.onReceiveError.addListener(onReceiveError);
            chrome.sockets.udp.bind(socketId, '0.0.0.0', 5353, function (result) {
                if (result < 0) {
                    console.log("Error binding socket.");
                    return;
                }
            })
        });
    }

    connect(conn) {
        this.servers.forEach((connection, index) => {
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
        this.servers.forEach(connection => {
            console.log(conn);
            console.log(connection);
            if (conn == connection) {
                connection.connected = false;
                connection.status = 'Available';
            }
        });
    }

    forget(conn) {
        this.servers.forEach((connection, index) => {
            if (conn == connection) {
                if (connection.available) {
                    connection.connected = false;
                    connection.status = 'Ready to Pair';
                    connection.saved = false;
                }
                else {
                    this.servers.splice(index, 1);
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

