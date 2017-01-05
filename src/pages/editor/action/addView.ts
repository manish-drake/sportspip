import { Injectable, Inject } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { AlertControllers } from '../../../Services/Alerts';
import { EditorPage } from '../editor';

@Injectable()
export class AddView implements ICommand {
    constructor(private alertCtrls: AlertControllers) {

    }
    run(cmdArgs) {
        if (cmdArgs.length <= 7) {
            var inum: number = cmdArgs.length + 1;
            cmdArgs.push({
                "Content": {},
                "_name": "View " + inum,
                "_Title": "View " + inum,
                "_Source": "(Blank)"
            });
            // this.showViewSegment(inum - 1);
        }
        else {
            this.alertCtrls.BasicAlert('Maximum 8 views!', 'No more views could be added.');
        }
    }
}