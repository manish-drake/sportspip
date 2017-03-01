import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import X2JS from 'x2js';
import { Alert } from '../Services/common/alerts';
import { Logger } from '../logging/logger';
import { NativeStorageFactory } from '../Services/Factory/NativeStorageFactory'

declare var chrome: any;

@Injectable()
export class Connection {

    constructor(private platform: Platform,
        private alertCtrls: Alert,
        private _logger: Logger,
        private _nativeStorageFactory: NativeStorageFactory) {
        this.getPort();
        this.getPairedServers();
    }

    public static servers: any[] = [];

    public static connectedServer: any = null;

    public static socketId: any;

    public static port: any = 5333;

    getPort() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._nativeStorageFactory.GetItem("sportspipport")
                    .then(res => {
                        this._logger.Debug("Got saved Port: " + res);
                        if (res != null) { Connection.port = res }
                    })
                    .catch(err => { this._logger.Debug("No saved Port: " + JSON.stringify(err)) })
            }
        })
    }

    public static pairedServers: any[] = [];

    getPairedServers() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._nativeStorageFactory.GetItem("pairedservers")
                    .then(res => {
                        this._logger.Debug("Got paired servers: " + res);
                        if (res != null) { Connection.pairedServers = JSON.parse(res) }
                    })
                    .catch(err => console.log("No paired server: " + JSON.stringify(err)))
            }
        });
    }

    scanUdp() {
        if (this.platform.is('cordova')) {
            this._logger.Debug("Starting Listening for Sports PIP servers on Port: " + Connection.port);
            var onReceive = function (info) {
                var binaryData = info.data;
                var dataStr = '';
                var ui8 = new Uint8Array(binaryData);
                for (var i = 39; i < ui8.length - 5; i++) {
                    dataStr = dataStr + String.fromCharCode(ui8[i]);
                }
                var parser = new X2JS();
                var data = parser.xml2js(dataStr)

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

                var isAlreadyGotserver = false;
                Connection.servers.forEach(element => {
                    if (server._ID == element.Id) {
                        isAlreadyGotserver = true;
                    }
                });

                if (!isAlreadyGotserver) {
                    Connection.servers.push(item);
                    Connection.servers.forEach(server => {
                        Connection.pairedServers.forEach(element => {
                            if (element == server.Id) {
                                server.saved = true;
                                if (Connection.connectedServer == null) {
                                    server.status = 'Connected';
                                    server.connected = true;
                                    Connection.connectedServer = server;
                                }
                            }
                        });
                    });
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
                chrome.sockets.udp.bind(createInfo.socketId, '0.0.0.0', Connection.port, function (result) {
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
        if (this.platform.is('cordova')) {
            chrome.sockets.udp.close(Connection.socketId, function (info) {
                Connection.servers.length = 0;
                console.log('connection closed: ' + info);
            });
            Connection.connectedServer = null;
        }
    }

    setPort(port) {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._nativeStorageFactory.SetItem("sportspipport", port)
                    .then(res => { this._logger.Debug("Saved Port successfully: " + res) })
                    .catch(err => { this._logger.Debug("Error saving port: " + JSON.stringify(err)) })
            }
        })
    }

    pair(server) {
        this.connect(server);
        this.addPairedServer(server.Id);
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
        this.removePairedServer(server.Id);
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

    addPairedServer(id) {
        this._logger.Debug("Remembering server with Id: " + id);
        var itemsColl = [];
        this._nativeStorageFactory.GetItem("pairedservers")
            .then(res => {
                itemsColl = JSON.parse(res);
                itemsColl.push(id);
                this._nativeStorageFactory.SetItem("pairedservers", JSON.stringify(itemsColl));
            })
            .catch(err => {
                itemsColl.push(id);
                this._nativeStorageFactory.SetItem("pairedservers", JSON.stringify(itemsColl));
            })
        this.getPairedServers();
    }

    removePairedServer(id) {
        this._logger.Debug("Removing paired server with Id: " + id);
        this._nativeStorageFactory.GetItem("pairedservers")
            .then(res => {
                var itemsColl = JSON.parse(res);
                itemsColl.forEach((element, index) => {
                    if (id == element) {
                        itemsColl.splice(index, 1);
                    }
                });
                this._nativeStorageFactory.SetItem("pairedservers", JSON.stringify(itemsColl));
            });
            this.getPairedServers();
    }

}