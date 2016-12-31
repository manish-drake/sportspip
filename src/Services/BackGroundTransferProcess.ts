import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Connection } from '../Services/Connection';
import { File } from 'ionic-native';
import X2JS from 'x2js';
import { Logger } from '../logging/logger';
import { Observable } from 'rxjs/Rx';
declare var cordova: any;


@Injectable()
export class BackGroundTransferProcess {
    private data: any;

    constructor(private platform: Platform, private http: Http, private _logger: Logger) {
    }
    TransferVideo(fileName, serverIP, views) {
        this._logger.Debug('Transfer video');
        File.readAsArrayBuffer(cordova.file.externalDataDirectory, fileName).then(success => {
            let headers = new Headers({ 'Content-Type': 'video/mp4' }); // ... Set content type to JSON
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://" + serverIP + ":10080/imatrix/matrices/" + fileName.slice(0, -4) + "/videos", success, options)
                .catch(err => new Observable(err => { return this._logger.Error('Error,transferring phone video: ', err) }))
                .subscribe(res => {
                    console.log(res);

                    this.data = this.createNewPhoneMatrix(0);
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
        this._logger.Debug('Transfer matrix');
        var serverAddress = Connection.connectedServer.Address;
        this.platform.ready().then(() => {
            let parser: any = new X2JS();
            var xmlMatrix = parser.js2xml(this.data);

            let headers = new Headers({ 'Content-Type': 'application/xml' });
            let options = new RequestOptions({ headers: headers });

            this.http.post("http://" + serverAddress + ":10080/imatrix/matrices/", xmlMatrix, options)
                .catch(err => new Observable(err => { return this._logger.Error('Error,transferring matrix: ', err); }))
                .subscribe(response => {
                    console.log("matrix successfully sent");
                })
        });
    }


    private createClips(fileName, duration, count) {
        this._logger.Debug('Create clips');
        try {
            var name = fileName;
            var view = "View" + " " + count;
            this.AddMatrixClip(name, view, this.data);
        }
        catch (err) {
            this._logger.Error('Error,creating clips: ', err);
        }
    }

    private AddMatrixClip(kernel, view, data) {
        this._logger.Debug('Add matrix clip');
        try {
            var clip = {
                "_Name": kernel,
                "_name": "",
                "_Key": view,
                "_Duration": "0"
            }
            data.Matrix.Clips.Clip.push(clip);
        }
        catch (err) {
            this._logger.Error('Error,adding matrix clip: ', err);
        }
    }

    private createNewPhoneMatrix(duration) {
        this._logger.Debug('Create phone matrix');
        try {
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
        catch (err) {
            this._logger.Error('Error,creating phone matrix: ', err);
        }
    }
}