import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'

declare var cordova: any;

@Injectable()
export class Storage {

    constructor(private platform: Platform) { }

    externalDataDirectory() {
        return this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                if (this.platform.is('android')) {
                    return cordova.file.externalDataDirectory;
                }
                else if (this.platform.is('ios')) {
                    // alert(cordova.file.dataDirectory);
                    return cordova.file.dataDirectory;
                }
            }
        })

    }

    externalRootDirectory() {
        return this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                if (this.platform.is('android')) {
                    return cordova.file.externalRootDirectory;
                }
                else if (this.platform.is('ios')) {
                    return cordova.file.documentsDirectory;
                }
            }
        })

    }

    applicationDirectory() {
        return this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                if (this.platform.is('android')) {
                    return cordova.file.applicationDirectory;
                }
                else if (this.platform.is('ios')) {
                    return cordova.file.applicationDirectory;
                }
            }
        })
    }

    applicationStorageDirectory() {
        return this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                if (this.platform.is('android')) {
                    return cordova.file.applicationStorageDirectory;
                }
            }
        })

    }

}