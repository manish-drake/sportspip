import { Injectable, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditorPage } from '../../pages/editor/editor';
import { StorageFactory } from '../Factory/StorageFactory';
import { Logger } from '../../logging/logger';
import { ICommand } from '../../Contracts/ICommand';
import { AlertControllers } from '../Alerts';

@Injectable()
export class OpenMatrix implements ICommand {

    constructor(private alertCtrls: AlertControllers,
        private navCtrl: NavController,
        private storagefactory: StorageFactory,
        private _logger: Logger) {
    }

    run(cmdArgs) {
        this._logger.Debug('open matrix..');
        this.storagefactory.ReadMatixFileAync("Local", cmdArgs.Channel, cmdArgs.Name, cmdArgs.Name + ".mtx")
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
                this._logger.Error('Error,open matrix: ', JSON.stringify(err));
                this.alertCtrls.BasicAlert('File Error!', "Either file is corrupt or did not download properly");
                // this.createNewMatrix(matrixName, Channel);
            });

    }
}