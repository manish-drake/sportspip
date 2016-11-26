import { Injectable } from "@angular/core";

import { Platform } from 'ionic-angular';

import X2JS from 'x2js';

import { Http, Headers, RequestOptions } from '@angular/http';

declare var chrome: any;
declare var cordova: any;

@Injectable()
export class Connection {
    constructor(private http: Http, private platform: Platform) { }

    public static servers = [];

    public static connectedServer: any = null;

    public static socketId: any;

    scanUdp() {
        this.platform.ready().then(() => {
            var onReceive = function (info) {
                var binaryData = (info.data);
                var dataStr = '';
                var ui8 = new Uint8Array(binaryData);

                for (var i = 39; i < ui8.length; i++) {
                    dataStr = dataStr + String.fromCharCode(ui8[i]);
                }
                var parser = new X2JS();
                var data = parser.xml2js('<Server name="DESKTOP-TBMV3MR" Name="DESKTOP-TBMV3MR" Information="Pro Matrix Server: DESKTOP-TBMV3MR" ID="4613d979dd574b89b55edfb5be9a896f" Location="192.168.10.7" Genre="Pro" Filename="" />');

                if (data == null) return;
                var server = data.Server;

                var item = {
                    Id: server._ID,
                    Address: info.remoteAddress,
                    Port: info.remotePort,
                    Data: { Name: server._Name, Information: server._Information, Location: server._Location },
                    status: 'Ready to Pair',
                    connected: false,
                    saved: false,
                    available: true
                };

                var isAlreadyGotserver = false;
                Connection.servers.forEach(element => {
                    if (server._ID == element.Id) {
                        isAlreadyGotserver = true;
                    }
                });

                if (!isAlreadyGotserver) {
                    Connection.servers.push(item);
                }
            }
            var onReceiveError = function (errorinfo) {
                console.log('onReceiveError:');
                console.log(errorinfo);
                alert('onReceiveError:' + errorinfo);
            }
            chrome.sockets.udp.create({}, function (createInfo) {
                Connection.socketId = createInfo.socketId;
                chrome.sockets.udp.onReceive.addListener(onReceive);
                chrome.sockets.udp.onReceiveError.addListener(onReceiveError);
                chrome.sockets.udp.bind(createInfo.socketId, '0.0.0.0', 5353, function (result) {
                    console.log('bind result: ' + result);
                    if (result < 0) {
                        console.log("Error binding socket.");
                        alert('Error searching servers');
                        return;
                    }
                })
            });
        });
    }

    transferMatrix(fileName) {
        var server = Connection.connectedServer.Address;
        this.http.get(cordova.file.applicationStorageDirectory + fileName).subscribe(success => {
            let headers = new Headers({ 'Content-Type': 'multipart/form-data' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://" + server + ":10080/imatrix/matrices/" + fileName + "/videos", success.text(), options)
                .subscribe(res => {
                    alert(res);
                })
        })
    }

    close() {
        this.platform.ready().then(() => {
            chrome.sockets.udp.close(Connection.socketId, function (info) {
                Connection.servers.length = 0;
                console.log('connection closed: ' + info);
            })
        });
    }

    connect(server) {
        Connection.servers.forEach((element, index) => {
            if (server == element) {
                Connection.connectedServer = element;
                element.connected = true;
                element.status = 'Connected';
                element.saved = true;
            }
            else {
                element.connected = false;
                if (element.saved == true) {
                    element.status = 'Available';
                }
                else {
                    element.status = 'Ready to Pair';
                }
            }
        });
    }

    disconnect(server) {
        Connection.servers.forEach(element => {
            if (server == element) {
                Connection.connectedServer = null;
                element.connected = false;
                element.status = 'Available';
            }
        });
    }

    forget(server) {
        Connection.servers.forEach((element, index) => {
            Connection.connectedServer = null;
            if (server == element) {
                if (element.connected || element.available) {
                    element.connected = false;
                    element.status = 'Ready to Pair';
                    element.saved = false;
                }
                else {
                    Connection.servers.splice(index, 1);
                }
            }
        });
    }
}