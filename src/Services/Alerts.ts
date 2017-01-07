import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertControllers {
    constructor(private alertCtrl: AlertController) {

    }

    BasicAlert(title, subTitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['OK']
        });
        alert.present();
    }
}