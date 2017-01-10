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

    ConfirmationAlert(title: string, message: string, btnText: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: btnText,
                        handler: () => {
                            alert.dismiss().then(() => { resolve(btnText); });
                        }
                    },
                    {
                        text: 'Cancel',
                        handler: () => {
                            alert.dismiss().then(() => { resolve("Cancel"); });
                        }
                    }
                ]
            });
            alert.present();

        })


    }

}