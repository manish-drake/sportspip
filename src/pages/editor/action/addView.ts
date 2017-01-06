import { Injectable, Inject } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { AlertControllers } from '../../../Services/Alerts';

@Injectable()
export class AddView implements ICommand {
    constructor(private alertCtrls: AlertControllers) {

    }
    
    run(cmdArgs) {
        if (cmdArgs.editor.views.length <= 7) {
            var inum: number = cmdArgs.editor.views.length + 1;
            cmdArgs.editor.views.push({
                "Content": {},
                "_name": "View " + inum,
                "_Title": "View " + inum,
                "_Source": "(Blank)"
            });
            cmdArgs.editor.showViewSegment(inum - 1,cmdArgs);
        }
        else {
            this.alertCtrls.BasicAlert('Maximum 8 views!', 'No more views could be added.');
        }
    }

}