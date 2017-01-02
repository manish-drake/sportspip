declare var cordova: any;
import { Injectable } from '@angular/core';

@Injectable()
export class Storage {

    constructor() { }

    externalDataDirectory() {
        return cordova.file.externalDataDirectory;
    }

    externalRootDirectory() {
        return cordova.file.externalRootDirectory;
    }

    applicationDirectory() {
        return cordova.file.applicationDirectory
    }

    applicationStorageDirectory() {
        return cordova.file.applicationStorageDirectory;
    }

}