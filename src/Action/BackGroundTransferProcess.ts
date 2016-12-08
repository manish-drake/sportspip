import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Connection } from '../pages/Connection';
import { File } from 'ionic-native';
import X2JS from 'x2js';
declare var cordova: any;

@Injectable()
export class BackGroundTransferProcess {
    data: any;

    constructor(private platform: Platform, private http: Http) {

    }


    TransferVideo(fileName) {
        var server = Connection.connectedServer.Address;

        File.readAsArrayBuffer(cordova.file.applicationStorageDirectory, fileName).then(success => {
            let headers = new Headers({ 'Content-Type': 'video/mp4' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://" + server + ":10080/imatrix/matrices/" + fileName.slice(0, -4) + "/videos", success, options)
                .subscribe(res => {
                    console.log(res);
                    // this.backGroundTransferProcessIP.transferMatrix(fileName.slice(0, -4), 5, "Phone", 1);
                })
        })
    }
}