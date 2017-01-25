import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { Alert } from '../../../Services/common/alerts';
import { ModelFactory } from '../../../Services/Factory/ModelFactory';

@Injectable()
export class AddView implements ICommand {
    constructor(private alertCtrls: Alert, private modelFactory: ModelFactory) {

    }

    run(cmdArgs) {
        if (cmdArgs.editor.views.length <= 7) {
            var inum: number = cmdArgs.editor.views.length + 1;
            var view = this.modelFactory.ComposeNewView(inum);
            cmdArgs.editor.views.push(view);
            cmdArgs.editor.setSelectedView(view, inum - 1);
        }
        else {
            this.alertCtrls.BasicAlert('Maximum 8 views!', 'No more views could be added.');
        }
    }

}