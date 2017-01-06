import { Injectable, Inject } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';

@Injectable()
export class AddCanvas implements ICommand {
    constructor() {

    }
    run(cmdArgs) {
        var canvasView = {
            "Content": {
                "PIP": {
                    "PIP.Objects": "",
                    "_name": "d002b8ed5fe24f57aab501f05398262c",
                    "_CanvasBackgroundBrush": "#FFFFFFFF",
                    "_CanvasBackgroundOpacity": "1"
                }
            },
            "_name": "View " + (cmdArgs.editor.selectedViewIndex + 1),
            "_Title": "View " + (cmdArgs.editor.selectedViewIndex + 1),
            "_Source": 'Canvas'
        }
        cmdArgs.editor.views[cmdArgs.editor.selectedViewIndex] = canvasView;
    }
}