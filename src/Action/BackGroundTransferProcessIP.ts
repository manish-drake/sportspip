import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from 'ionic-angular';
import X2JS from 'x2js';
import { Logger } from '../logging/logger';
import { Observable } from 'rxjs/Rx';
declare var FileTransfer: any;
declare var cordova: any;
@Injectable()
export class BackGroundTransferProcessIP {
    private data: any;

    constructor(private platform: Platform, private http: Http, private _logger: Logger) {

    }

    //............................matrix transfer code.........................................

    transferMatrix(fileName, duration, CamsCount, server) {
        this._logger.Debug('Transfer IP Matrix');

        this.createClips(fileName, duration, CamsCount, server);
        let parser: any = new X2JS();
        var xmlMatrix = parser.js2xml(this.data);

        let headers = new Headers({ 'Content-Type': 'application/xml' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://" + server + ":10080/imatrix/matrices/", xmlMatrix, options)
            .catch(err => new Observable(err => { return this._logger.Error('Error,transferring IP matrix: ', err) }))
            .map(response => {
                if (response["status"] == 200)
                    return true;
                else return this._logger.Error('Error,transferring IP matrix,Staus code: ', response["status"])
            }).toPromise()


    }

    private createClips(fileName, duration, CamsCount, serverAddress) {
        try {
            this.data = this.createNewIPMatrix(fileName, duration);
            var i = 1;
            while (i <= CamsCount) {
                var name = fileName + "_" + i + ".mp4"
                var view = "View" + " " + i;
                this.AddMatrixClip(name, view, this.data);
                i++;
            }
        }
        catch (err) {
            this._logger.Error('Error,creating clips (IP): ', err);
        }
    }
    GetServerIPVideo(fileName, serverAddress) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "http://" + serverAddress + ":10080/isportspip/sports/video/" + fileName, true); // url is my google cloud storage url
            xhr.responseType = 'blob';
            xhr.onload = function (e) {
                if (xhr.status == 200) {
                    resolve(xhr);
                } else { return reject('This request has failed ' + xhr.status); }
            };
            xhr.onerror = function (err) {
                return reject(err + xhr.statusText);
            };
            xhr.send()
        })
    }

    private createNewIPMatrix(fileName, duration) {
        try {
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
        catch (err) {
            this._logger.Error('Error,creating IP matrix: ', err);
        }
    }


    private AddMatrixClip(kernel, view, data) {
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
            this._logger.Error('Error,adding matrix clip (IP): ', err);
        }
    }

    //..............................matrix transfered.......................................
}