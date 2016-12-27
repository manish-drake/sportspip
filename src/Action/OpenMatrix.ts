import { Injectable } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { EditorPage } from '../pages/editor/editor';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
import { StorageFactory } from '../Factory/StorageFactory';
import { Logger } from '../logging/logger';
import { AlertControllers } from '../Action/Alerts';

declare var cordova: any;
@Injectable()
export class OpenMatrix {

    constructor(private http: Http,
        private alertCtrls: AlertControllers,
        private navCtrl: NavController,
        private platform: Platform,
        private storagefactory: StorageFactory,
        private _logger: Logger) {
    }

    run(matrixName, Channel) {
        this._logger.Debug('open matrix..');
        try {
            File.readAsText(cordova.file.dataDirectory + "Local/" + Channel + "/Tennis/Matrices/" + matrixName, matrixName + ".mtx")
                .then(data => {
                    console.log("open matrix");
                    var res = JSON.parse(data.toString());
                    var view = res.Matrix["Matrix.Children"].View;
                    if (view != undefined) {
                        this.navCtrl.push(EditorPage, {
                            matrixData: res.Matrix
                        });
                    }
                }).catch(err => {
                    console.log("mtx not found");
                    this.alertCtrls.BasicAlert('File Error!', "Either file is corrupt or did not download properly");
                    // this.createNewMatrix(matrixName, Channel);
                });
        }
        catch (err) {
            this._logger.Error('Error,open matrix: ', err);
        }

    }
}