import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { AlertControllers } from '../../../Services/Alerts';
import { ModelFactory } from '../../../Services/Factory/ModelFactory';

@Injectable()
export class AddView implements ICommand {
    constructor(private alertCtrls: AlertControllers, private modelFactory: ModelFactory) {

    }

    run(cmdArgs) {
        if (cmdArgs.editor.views.length <= 7) {
            var inum: number = cmdArgs.editor.views.length + 1;
            var view = this.modelFactory.ComposeNewView(inum);
            cmdArgs.editor.views.push(view);
            cmdArgs.editor.showViewSegment(inum - 1, cmdArgs);
        }
        else {
            this.alertCtrls.BasicAlert('Maximum 8 views!', 'No more views could be added.');
        }
    }

}