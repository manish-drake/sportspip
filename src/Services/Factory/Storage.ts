declare var cordova: any;
import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular'

@Injectable()
export class Storage {

    constructor(private platform: Platform) { }

    externalDataDirectory() {
        if (this.platform.is('cordova')) {
            return cordova.file.externalDataDirectory;
        }
    }

    externalRootDirectory() {
        if (this.platform.is('cordova')) {
            return cordova.file.externalRootDirectory;
        }
    }

    applicationDirectory() {
        if (this.platform.is('cordova')) {
            return cordova.file.applicationDirectory
        }
    }

    applicationStorageDirectory() {
        if (this.platform.is('cordova')) {
            return cordova.file.applicationStorageDirectory;
        }
    }

}