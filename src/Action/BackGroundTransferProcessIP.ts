import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from 'ionic-angular';
import X2JS from 'x2js';
import { File, WriteOptions } from 'ionic-native';
import { Logger } from '../logging/logger';

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
        try {
            this.createClips(fileName, duration, CamsCount, server);
            let parser: any = new X2JS();
            var xmlMatrix = parser.js2xml(this.data);

            let headers = new Headers({ 'Content-Type': 'application/xml' });
            let options = new RequestOptions({ headers: headers });
            return this.http.post("http://" + server + ":10080/imatrix/matrices/", xmlMatrix, options)
                .map(response => {
                    return true
                }).toPromise();
        }
        catch (err) {
            this._logger.Error('Error,transferring IP matrix: ',err);
        }
    }

    private createClips(fileName, duration, CamsCount, serverAddress) {
        this._logger.Debug('Create clips (IP)');
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
        this._logger.Debug('Get server IP video');
        try {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', "http://" + serverAddress + ":10080/isportspip/sports/video/" + fileName, true); // url is my google cloud storage url
                xhr.responseType = 'blob';
                xhr.onload = function (e) {
                    var writeOptions: WriteOptions = { replace: true }
                    var blob = xhr.response;
                    return File.createFile(cordova.file.externalRootDirectory + "SportsPIP/Video", fileName, true)
                        .then((success) => {
                            return File.writeFile(cordova.file.externalRootDirectory + "SportsPIP/Video", fileName, blob.slice(8), writeOptions)
                                .then((success) => {
                                    return resolve(xhr.response);
                                }).catch(() => { return reject(xhr.statusText); })
                        })
                };
                xhr.send()
            })
        }
        catch (err) {
            this._logger.Error('Error,getting server IP video: ', err);
        }
    }

    private createNewIPMatrix(fileName, duration) {
        this._logger.Debug('Create IP matrix');
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
        this._logger.Debug('Add matrix clip (IP)');
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