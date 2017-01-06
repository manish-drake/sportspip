import { Injectable } from "@angular/core";
import { ModelFactory } from './Factory/ModelFactory';

import { StorageFactory } from './Factory/StorageFactory';
import { Storage } from './Factory/Storage';

@Injectable()
export class Core {
    storageDataDir: string;
    constructor(private storageFactory: StorageFactory, private modelFactory: ModelFactory, private storage: Storage) {
        this.storageDataDir = this.storage.externalDataDirectory();
    }

    GetLocalHeader(): Promise<any> {
        var localMatrices = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Local").then((list) => {
                list.forEach((channelName) => {
                    return this.storageFactory.GetLisOfDirectory(this.storageDataDir + "Local/" + channelName.name + "/Tennis", "Matrices").then((success) => {
                        success.forEach((res) => {
                            return this.storageFactory.ReadMatixFileAync("Local", channelName.name, res.name, "Header.xml").then((data) => {
                                //deserialiae server header  
                                var result = JSON.parse(data.toString());
                                // console.log(result);
                                var item = this.modelFactory.ComposeHeader(result);
                                localMatrices.unshift(item);
                                return resolve(localMatrices);
                            })
                        })

                    })
                })

            })
        })

    }

    GetServerHeader(): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/").then((success) => {
                success.forEach((channelName) => {
                    return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                        success.forEach((res) => {
                            return this.storageFactory.ReadMatixFileAync("Server", channelName.name, res.name, "Header.xml")
                                .then(data => {
                                    // deserialiae server header  
                                    var result = JSON.parse(data.toString());
                                    var item = this.modelFactory.ComposeHeader(result);
                                    channels.unshift(item);
                                    resolve(channels);
                                });
                        });
                    });
                })
            })
        })
    }

    GetMatrixListByChannel(channel): Promise<any> {
        var channels = [];
        return new Promise((resolve, reject) => {
            return this.storageFactory.GetLisOfDirectory(this.storageDataDir, "Server/" + channel + "/Tennis/Matrices/").then((success) => {
                success.forEach((res) => {
                    return this.storageFactory.ReadMatixFileAync("Server", channel, res.name, "Header.xml")
                        .then(data => {
                            //deserialiae server header  
                            var result = JSON.parse(data.toString());
                            // var result = header.Header;
                            var item = this.modelFactory.ComposeHeader(result);
                            channels.unshift(item);

                            return resolve(channels);
                        });
                });

            });
        })

    }
}