declare var cordova: any;
import { Injectable } from '@angular/core';

export interface IStorage {
    dataDirectory(): any;
    rootDirectory(): any;
}
@Injectable()
export class Storage implements IStorage {

    constructor() { }

    dataDirectory() {
        return cordova.file.externalDataDirectory;
    }

    rootDirectory() {
        return cordova.file.externalRootDirectory;
    }

}