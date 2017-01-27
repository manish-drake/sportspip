import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { Logger } from '../../logging/logger';

@Injectable()
export class Alert {
    constructor(private alertCtrl: AlertController,
        private _logger: Logger) {

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

    PromptAlert(title, message, inputName, inputPlaceholder, inputValue) {
        return new Promise((resolve, reject) => {
            let prompt = this.alertCtrl.create({
                title: title,
                message: message,
                inputs: [
                    {
                        name: inputName,
                        placeholder: inputPlaceholder,
                        value: inputValue
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: data => { this._logger.Debug('Cancel clicked'); }
                    },
                    {
                        text: 'Save',
                        handler: data => { resolve(data) }
                    }
                ]
            });
            prompt.present();
        })
    }

}