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

    constructor(public navCtrl: NavController) { }

    ionViewDidLoad() {
        console.log('Hello Connectivity Page');
        this.scanUdp();
    }

    public servers = [];

    call = (res): void => {
        alert('Called');
    }

    scanUdp() {
        var serverstemp = [];
        var onReceive = function (info) {
            var binaryData = (info.data);
            var dataStr = '';
            var ui8 = new Uint8Array(binaryData);
            for (var i = 0; i < ui8.length; i++) {
                dataStr = dataStr + String.fromCharCode(ui8[i]);
            }

            let parser: any = new X2JS();
            var data = parser.xml2js(dataStr);
            // alert( JSON.stringify(data));
            // var serverData = JSON.parse(data.text());
            // var server = { _name: data.Server._name };

            // alert(data.Server._name);

            var item = { name: 'Server11' };

            serverstemp.push(item);
            alert(serverstemp.length);
            this.servers.push(item);
            alert('...' + this.servers.length);
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

    connections = [
        { _name: 'Server 1', status: 'Ready to Pair', _Location: '192.168.1.267', _Information: 'Sports PIP Server', connected: false, saved: false, available: true },
        { _name: 'Server 2', status: 'Ready to Pair', _Location: '192.168.1.268', _Information: 'Sports PIP Server', connected: false, saved: false, available: true },
        { _name: 'Server 3', status: 'Ready to Pair', _Location: '192.168.1.269', _Information: 'Sports PIP Server', connected: false, saved: false, available: true },
        { _name: 'Server 4', status: 'Unavailable', _Location: '192.168.1.270', _Information: 'Sports PIP Server', connected: false, saved: true, available: false }
    ];

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

    forget(i) {
        this.connections.forEach((connection, index) => {
            if (i == index) {
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

