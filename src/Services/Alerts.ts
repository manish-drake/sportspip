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

    // ConfirmationAlert(title, CancelText, OkText){
    //     var value: any;
    //     let confirm = this.alertCtrl.create({
    //         title: ' Download Confirmation?',
    //         buttons: [
    //             {
    //                 text: CancelText,
    //                 handler: () => { console.log('Cancel clicked'); value = "Cancel" }
    //             },
    //             {
    //                 text: OkText,
    //                 handler: () => {
    //                     console.log('Download clicked');
    //                     value = "Download";
    //                 }
    //             }
    //         ]
    //     });
    //   confirm.present();
    // }
}