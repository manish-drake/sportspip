import { Injectable } from '@angular/core';
import { ICommand } from '../../../../Contracts/ICommand';
import {  ModalController} from 'ionic-angular';
import { IpCamSettingsModal } from '../../../../pages/editor/ipcamsettings-modal/ipcamsettings-modal'


@Injectable()
export class OpenSettingModal implements ICommand {
    constructor(private modalCtrl: ModalController,) {

    }

    run(cmdArgs) {
        let modal = this.modalCtrl.create(IpCamSettingsModal, {
            timerDelay: cmdArgs.timer.timerDelay
        });
        modal.present();
        modal.onDidDismiss(TimerDelay => {
            cmdArgs.timer = TimerDelay;
        });
    }
}