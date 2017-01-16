import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

import { ICommand } from '../../../Contracts/ICommand';
import { AlertControllers } from '../../../Services/Alerts';

@Injectable()
export class DeleteView implements ICommand {

    constructor(private actionSheetCtrl: ActionSheetController, private alertCtrls: AlertControllers) { }

    run(cmdArgs) {
        if (cmdArgs.editor.views.length > 1) {
            let actionSheet = this.actionSheetCtrl.create({
                title: "View "+ (cmdArgs.index + 1),
                buttons: [
                    {
                        icon: 'trash',
                        text: 'Delete View',
                        role: 'destructive',
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
                    }, {
                        icon: 'close',
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
            actionSheet.present();
        }
        else {
            this.alertCtrls.BasicAlert('Can not be deleted!', 'Atleast 1 view is required.');
        }
    }
}