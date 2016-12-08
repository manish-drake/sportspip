import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Connection } from '../pages/Connection';
import X2JS from 'x2js';

@Injectable()
export class BackGroundTransferProcessIP {
    private data: any;

    constructor(private platform: Platform, private http: Http) {
        
    }

    //............................matrix transfer code.........................................

    transferMatrix(fileName, duration, CamsCount) {
        var serverAddress = Connection.connectedServer.Address;
        this.platform.ready().then(() => {

            this.createClips(fileName, duration, CamsCount);
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

    private createClips(fileName, duration, CamsCount) {
        this.data = this.createNewIPMatrix(fileName, duration);
        var i = 1;
        while (i <=  CamsCount) {
            var name = fileName + "_" + i + ".mp4"
            var view = "View" + " " + i;
            this.AddMatrixClip(name, view, this.data);
            i++;
        }
    }

    private createNewIPMatrix(fileName, duration) {
        var name = Date.now().toString();
        let data =
            {
                "Matrix": {
                    "_Name": fileName,
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


    private AddMatrixClip(kernel, view, data) {
        var clip = {
            "_Name": kernel,
            "_name": "",
            "_Key": view,
            "_Duration": "0"
        }
        data.Matrix.Clips.Clip.push(clip);
    }

    //..............................matrix transfered.......................................
}