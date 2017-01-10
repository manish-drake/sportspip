import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import X2JS from 'x2js';
import { Http } from '@angular/http';

import { AlertControllers } from '../Services/Alerts';
import { Logger } from '../logging/logger';

declare var chrome: any;

@Injectable()
export class Connection {

    constructor(private platform: Platform,
        private alertCtrls: AlertControllers,
        private _logger: Logger) {  }

    public static servers = [];

    public static connectedServer: any = null;

    public static socketId: any;

    scanUdp() {
        if (this.platform.is('cordova')) {
            this._logger.Debug("Starting Listening for Sports PIP servers");
            var onReceive = function (info) {
                var binaryData = info.data;
                var dataStr = '';
                var ui8 = new Uint8Array(binaryData);
                for (var i = 39; i < ui8.length - 5; i++) {
                    dataStr = dataStr + String.fromCharCode(ui8[i]);
                }
                var parser = new X2JS();
                // alert(dataStr);
                var data = parser.xml2js(dataStr)
                // alert(JSON.stringify(data));

                if (data == null) return;
                var server = data.Server;
                var item = {
                    Id: server._ID,
                    Address: server._Location,
                    Port: info.remotePort,
                    Data: { Name: server._Name, Information: server._Information, Location: server._Location },
                    status: 'Ready to pair',
                    connected: false,
                    saved: false,
                    available: true
                };
                // alert(JSON.stringify(item));

                var isAlreadyGotserver = false;
                Connection.servers.forEach(element => {
                    if (server._ID == element.Id) {
                        isAlreadyGotserver = true;
                    }
                });

                if (!isAlreadyGotserver) {
                    Connection.servers.push(item);
                    // alert(JSON.stringify(Connection.servers));
                }
            }
            var onReceiveError = function (errorinfo) {
                console.log("Error listening for Sports PIP servers: " + errorinfo);
                this.alertCtrls.BasicAlert("Error listening server broadcast", errorinfo);
            }
            chrome.sockets.udp.create({}, function (createInfo) {
                console.log("Created UDP Socket:" + JSON.stringify(createInfo));
                Connection.socketId = createInfo.socketId;
                chrome.sockets.udp.onReceive.addListener(onReceive);
                chrome.sockets.udp.onReceiveError.addListener(onReceiveError);
                chrome.sockets.udp.bind(createInfo.socketId, '0.0.0.0', 5333, function (result) {
                    console.log("udp scan bind result: " + result);
                    if (result < 0) {
                        console.log("Error binding socket. " + result);
                        this.alertCtrls.BasicAlert("Error listening server broadcast", result);
                        return;
                    }
                })
            });
        }
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