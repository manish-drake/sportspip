import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
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
    TransferVideo(fileName, serverIP, views) {
        File.readAsArrayBuffer(cordova.file.applicationStorageDirectory, fileName).then(success => {
            let headers = new Headers({ 'Content-Type': 'video/mp4' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://" + serverIP + ":10080/imatrix/matrices/" + fileName.slice(0, -4) + "/videos", success, options)
                .subscribe(res => {
                    console.log(res);

                    this.data = this.createNewIPMatrix(0);
                    views.forEach((view, index) => {
                        if (view.Content !== undefined) {
                            if (view.Content.Capture != undefined) {
                                this.createClips(view.Content.Capture._Kernel, 0, index + 1);
                            }
                        }

                    });
                    this.transferMatrix();
                })
        })
    }

    transferMatrix() {
        var serverAddress = Connection.connectedServer.Address;
        this.platform.ready().then(() => {
            let parser: any = new X2JS();
            var xmlMatrix = parser.js2xml(this.data);

            let headers = new Headers({ 'Content-Type': 'application/xml' });
            let options = new RequestOptions({ headers: headers });

            this.http.post("http://" + serverAddress + ":10080/imatrix/matrices/", xmlMatrix, options)
                .subscribe(response => {
                    console.log("matrix successfully sent");
                })
        });
    }


    private createClips(fileName, duration, count) {
        var name = fileName;
        var view = "View" + " " + count;
        this.AddMatrixClip(name, view, this.data);
    }

    private AddMatrixClip(kernel, view, data) {
        var clip = {
            "_Name": kernel,
            "_name": "",
            "_Key": view,
            "_Duration": "0"
        }
        data.Matrix.Clips.Clip.push(clip);
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
                    "_Source": "Phone",
                    "Clips": {
                        "Clip": []
                    }
                }
            };
        return data;
    }
}