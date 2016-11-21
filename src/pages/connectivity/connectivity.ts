import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { } from 'ionic-native';

import { Connection } from '../../pages/Connection';

import X2JS from 'x2js';
import { Http, Headers } from '@angular/http';

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
        private connection: Connection,
        private alertCtrl: AlertController,
        private http: Http) { }

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

    ipCams = [];

    previewIPCams() {
        this.ipCams.length = 0;

        if (Connection.connectedServer == null) {
            let alert = this.alertCtrl.create({
                title: 'Not connected!',
                subTitle: 'Not connected to any server',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            var connectedServerIP = Connection.connectedServer.Address;
            var Port = Connection.connectedServer.Port;

            var requestUri = "http://" + connectedServerIP + ":10080/icamera/cams/ip/";
            console.log('Requesting: ' + requestUri);

            this.http.get(requestUri)
                .map(res => res.text())
                .subscribe(
                data => {
                    console.log('data: ' + data)
                    let parser: any = new X2JS();
                    var jsonData = parser.xml2js(data);
                    console.log(jsonData.Cams);
                    this.ipCams = jsonData.Cams.IPCam;
                },
                err => console.error('There was an error: ' + err),
                () => console.log('Random Quote Complete')
                );
        }
    }

    stringifyJSON(data) {
        return JSON.stringify(data);
    }


    getIPCamPreview(ipAdd) {
        var requestUri = "http://" + ipAdd + "/Streaming/channels/101/picture"

        this.http.get(requestUri)
            .map(res => res.text())
            .subscribe(
            data => {
                console.log('data: ' + data)
            },
            err => console.error('There was an error: ' + err),
            () => console.log('Random Quote Complete')
            );
    }
}

