import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Connection } from '../pages/Connection';
import { File } from 'ionic-native';
import X2JS from 'x2js';
declare var cordova: any;

@Injectable()
export class BackGroundTransferProcess {
    private data: any;

    constructor(private platform: Platform, private http: Http) {

    }
    TransferVideo(fileName, serverIP) {
        File.readAsArrayBuffer(cordova.file.applicationStorageDirectory, fileName).then(success => {
            let headers = new Headers({ 'Content-Type': 'video/mp4' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://" + serverIP + ":10080/imatrix/matrices/" + fileName.slice(0, -4) + "/videos", success, options)
                .subscribe(res => {
                    console.log(res);
                    // this.backGroundTransferProcessIP.transferMatrix(fileName.slice(0, -4), 5, "Phone", 1);
                })
        })
    }


    private createClips(fileName, duration, CamsCount) {
        this.data = this.createNewIPMatrix(0);
        var i = 1;
        while (i <= CamsCount) {
            var name = fileName + "_" + i + ".mp4"
            var view = "View" + " " + i;
            // this.AddMatrixClip(name, view, this.data);
            i++;
        }
    }

    private createNewIPMatrix(duration) {
        var name = Date.now().toString();
        let data =
            {
                "Matrix": {
                    "_Name": name,
                    "_Title": "Title1",
                    "_Sport": "Tennis",
                    "_Skill": "Serve",
                    "_PIN": " ",
                    "_DateModified": name,
                    "_Duration": duration,
                    "_Location": "Field",
                    "_HasTransferred": false,
                    "_Source": "IP",
                    "Clips": {
                        "Clip": []
                    }
                }
            };
        return data;
    }
}