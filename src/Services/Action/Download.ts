import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Observable } from 'rxjs/Rx';
import { Logger } from '../../logging/logger';
import { Package } from '../../Services/Package';
@Injectable()
export class Download {
    constructor(private packages: Package, private platform: Platform, private storagefactory: StorageFactory, private _logger: Logger) {

    }
    Run(fileName, channelName) {
        this._logger.Debug('Downloading matrix from server')
        var authenticate = this.AuthenticateUser();
        return new Promise(function (resolve, reject) {
            if (authenticate) {

                this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
                    Observable.interval(2000)
                        .take(3).map((x) => x + 5)
                        .subscribe((x) => {
                            this.packages.unzipPackage();
                            console.log("unzip");
                        })
                    Observable.interval(4000)
                        .take(1).map((x) => x + 5)
                        .subscribe((x) => {
                            this.packages.MoveToLocalCollection(channelName);
                            console.log("matrix moved");
                        })
                    Observable.interval(6000)
                        .take(1).map((x) => x + 5)
                        .subscribe((x) => {
                            this.platform.ready().then(() => {
                                this.storagefactory.RemoveFileAsync("file:/storage/emulated/0/DCIM", "Temp").then(() => {
                                    return resolve(true);
                                });
                            })
                        })
                }).catch((err) => { this._logger.Error('Error,Downloading matrix from server', err) })

            }

        })
    }

    AuthenticateUser() {
        console.log("Authenticatnig user..");
        return true;
    }
}