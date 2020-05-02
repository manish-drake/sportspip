import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType, Response } from '@angular/http';
import { Platform } from 'ionic-angular';
import X2JS from 'x2js';
import { Logger } from '../logging/logger';
import { StorageFactory } from './Factory/StorageFactory';
import { ModelFactory } from './Factory/ModelFactory';
import { HttpService } from './httpService';
import { Storage } from './Factory/Storage';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BackGroundTransferProcessIP {
    private data: any;
    private rootDir: string;
    constructor(private platform: Platform,
        private modelFactory: ModelFactory,
        private http: Http,
        private httpService: HttpService,
        private _logger: Logger,
        private storageFactory: StorageFactory,
        private storage: Storage) {

        this.storage.externalRootDirectory().then((res) => {
            this.rootDir = res;
        })


    }

    //............................matrix transfer code.........................................

    transferMatrix(fileName, duration, CamsCount, server) {
        this._logger.Debug('Transfer IP Matrix');

        this.createClips(fileName, duration, CamsCount, server);
        let parser: any = new X2JS();
        var xmlMatrix = parser.js2xml(this.data);

        let headers = new Headers({ 'Content-Type': 'application/xml' });
        let options = new RequestOptions({ headers: headers });
        return this.httpService.PostFileToServer("http://" + server + ":10080/imatrix/matrices/", xmlMatrix, options)/*$Candidate for refactoring$*///delegate http tasks to a service
            .catch(err => new Observable(err => { return this._logger.Error('Error,transferring IP matrix: ', err) }))
            .then(response => {
                if (response["status"] == 200)
                    return true;
                else return this._logger.Error('Error,transferring IP matrix,Staus code: ', response["status"])
            })


    }

    private createClips(fileName, duration, CamsCount, serverAddress) {
        this.data = this.createNewIPMatrix(fileName, duration);
        var i = 1;
        while (i <= CamsCount) {
            var name = fileName + "_" + i + ".mp4"
            var view = "View" + " " + i;
            this.AddMatrixClip(name, view);
            i++;
        }
    }
    GetServerIPVideo(fileName, serverAddress) {
        console.log("downloading..");
        let headers = new Headers({ 'Content-Type': 'application/pdf' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        var url = "http://" + serverAddress + ":10080/isportspip/sports/video/" + fileName;
        return this.http.get(url, options)
            .map(this.extractContent);
    }

    private extractContent(res: Response) {
        console.log("extracting..");
        let blob: Blob = res.blob();
        return blob;
    }

    private createNewIPMatrix(fileName, duration) {
        return this.modelFactory.createMatrixforServer(fileName, duration, "IP");
    }


    private AddMatrixClip(kernel, view) {
        var clip = {
            "_Name": kernel,
            "_name": "",
            "_Key": view,
            "_Duration": "0"
        }
        this.data.Matrix.Clips.Clip.push(clip);
    }

    //..............................matrix transfered.......................................
}