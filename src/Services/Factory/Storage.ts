import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular'

declare var cordova: any;

@Injectable()
export class Storage {

    constructor(private platform: Platform) {
        this.platform = platform;
    }

    externalDataDirectory() {
        if (this.platform.is('cordova')) {
            if (this.platform.is('android')) {
                return cordova.file.externalDataDirectory;
            }
            if (this.platform.is('ios')) {
                return cordova.file.dataDirectory;
            }
        }
    }

    externalRootDirectory() {
        if (this.platform.is('cordova')) {
            if (this.platform.is('android')) {
                return cordova.file.externalRootDirectory;
            }
            else if (this.platform.is('ios')) {
                return cordova.file.documentsDirectory;
            }
        }
    }

    applicationDirectory() {
        if (this.platform.is('cordova')) {
            if (this.platform.is('android')) {
                return cordova.file.applicationDirectory;
            }
            else if (this.platform.is('ios')) {
                return cordova.file.applicationDirectory;
            }
        }
    }

    applicationStorageDirectory() {
        if (this.platform.is('cordova')) {
            if (this.platform.is('android')) {
                return cordova.file.applicationStorageDirectory;
            }
            else if (this.platform.is('ios')) {
                return cordova.file.applicationStorageDirectory;
            }
        }
    }

}