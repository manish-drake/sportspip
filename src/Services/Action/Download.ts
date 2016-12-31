import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Observable } from 'rxjs/Rx';
import { Package } from '../../Services/Package';
@Injectable()
export class Download {
    constructor(private packages: Package, private platform: Platform, private storagefactory: StorageFactory, ) {

    }
    Run(fileName, channelName, index) {
        var authenticate = this.AuthenticateUser();
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

                            });
                        })
                    })
            })

        }

    }

    AuthenticateUser() {
        console.log("Authenticatnig user..");
        return true;
    }
}