import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { StorageFactory } from '../Factory/StorageFactory';


@Injectable()
export class DeleteHeader {

    constructor(private http: Http, private platform: Platform, private storagefactory: StorageFactory) {

    }

    DeleteLocalHeader(DirName, channel) {
        this.storagefactory.DeleteLocalHeader(DirName, channel);
    }
}