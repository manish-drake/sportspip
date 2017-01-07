import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { NavController } from 'ionic-angular';
import { Ipcameras } from '../../editor/ipcameras/ipcameras'
import { Logger } from '../../../logging/logger';

@Injectable()
export class AddIpCamCapture implements ICommand {
    constructor(private navCtrl: NavController, private _logger: Logger) {

    }

    run(cmdArgs) {
        this._logger.Debug('Navigates to IP Cameras page..');
        this.navCtrl.push(Ipcameras, {
            matrix: cmdArgs.matrix,
            views: cmdArgs.views,
            selectedViewIndex: cmdArgs.selectedViewIndex
        });
    }
}