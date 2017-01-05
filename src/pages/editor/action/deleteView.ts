import { Injectable, Inject } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { AlertController } from 'ionic-angular';
import { AlertControllers } from '../../../Services/Alerts';

@Injectable()
export class DeleteView implements ICommand {
    constructor(private alertCtrl: AlertController, private alertCtrls: AlertControllers) {

    }
    //  "views": this.views,
    //   "showViewSegment": this.showViewSegment,
    //   "evaluateCaptureViews": this.evaluateCaptureViews,
    //   "selectedViewIndex": this.selectedViewIndex,
    //   "index": i


    run(cmdArgs) {
        if (cmdArgs.editor.views.length > 1) {
            let confirm = this.alertCtrl.create({
                title: 'Are you sure?',
                message: 'Do you want to delete the view pressed?',
                buttons: [
                    {
                        text: 'Cancel',
                        handler: () => { }
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            cmdArgs.editor.views.splice(cmdArgs.index, 1);
                            if (cmdArgs.editor.selectedViewIndex == 0) {
                                cmdArgs.editor.showViewSegment(0);
                            }
                            else {
                                cmdArgs.editor.showViewSegment(cmdArgs.index - 1)
                            }
                            cmdArgs.editor.evaluateCaptureViews();
                        }
                    }
                ]
            });
            confirm.present();
        }
        else {
            this.alertCtrls.BasicAlert('Can not be deleted!', 'Atleast 1 view is required.');
        }
    }
}