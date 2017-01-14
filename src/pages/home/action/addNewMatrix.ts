import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { ModelFactory } from '../../../Services/Factory/ModelFactory';
import { Core } from '../../../Services/core';
import { Logger } from '../../../logging/logger';
import { NavController } from 'ionic-angular';
import { EditorPage } from '../../editor/editor';


@Injectable()
export class AddNewMatrix implements ICommand {
    constructor(private modelFactory: ModelFactory, private _logger: Logger, private core: Core, private navCtrl: NavController) 
    {

    }
    
    run(cmdArgs) {
        this._logger.Debug('Creating new matrix..');
        var data = this.modelFactory.ComposeNewMatrix();
        var result = data.Matrix;
        this.core.SaveMatrixAsync(data, result._Channel, result._Sport, result._Name, "Matrices").then((success) => {
            var headerContent = this.modelFactory.ComposeNewMatrixHeader(result);
            this.core.SaveLocalHeader(headerContent, headerContent.Channel, headerContent.Sport, headerContent.Name, "Matrices")
                .then((success) => {
                    this.navCtrl.push(EditorPage, {
                        matrixData: result
                    });
                });
        })
    }
}