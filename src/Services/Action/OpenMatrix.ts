import { Injectable } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { EditorPage } from '../../pages/editor/editor';
import { Core } from '../core';
import { Storage } from '../Factory/Storage';
import { Logger } from '../../logging/logger';
import { ICommand } from '../../Contracts/ICommand';
import { AlertControllers } from '../Alerts';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class OpenMatrix implements ICommand {
    storageDataDir: string
    constructor(private alertCtrls: AlertControllers,
        private navCtrl: NavController,
        private storage: Storage,
        private core: Core,
        private platform: Platform,
        private _logger: Logger) {
        this.platform.ready().then(() => {
            this.storageDataDir = this.storage.externalDataDirectory();
        })
    }

    run(cmdArgs) {
        this._logger.Debug('open matrix..');
        this.core.ReadMatrixFile(this.storageDataDir + "Local/" + cmdArgs.Channel + "/Tennis/Matrices/" + cmdArgs.Name, cmdArgs.Name + ".mtx")
            .catch(err => new Observable(err => {
                this.alertCtrls.BasicAlert('File Error!', "Either file is corrupt or did not download properly");
                this._logger.Error('Error,open matrix: ', err);
                // this.createNewMatrix(matrixName, Channel);
            }))
            .subscribe(data => {
                console.log("open matrix");
                var res = JSON.parse(data.toString());
                var view = res.Matrix["Matrix.Children"].View;
                if (view != undefined) {
                    this.navCtrl.push(EditorPage, {
                        matrixData: res.Matrix
                    });
                }
            })

    }
}