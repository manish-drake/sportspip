import { Injectable, Inject } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { Logger } from '../../../logging/logger';
import { ModelFactory } from '../../../Services/Factory/ModelFactory';

@Injectable()
export class SaveMatrix {
    constructor(private storagefactory: StorageFactory, private modelFactory: ModelFactory, private _logger: Logger) {

    }
    run(channel, matrixName, views): Promise<any> {
        this._logger.Debug("Matrix file saving..")
        return new Promise((resolve, reject) => {
            return this.storagefactory.ReadMatixFileAync("Local", channel, matrixName, matrixName + ".mtx")
                .then((data) => {
                    var res = JSON.parse(data.toString());
                    var matrix = res.Matrix;
                    matrix['Matrix.Children'].View = views;
                    var thumbName = this.GetThumbName(matrix);
                    return this.storagefactory.SaveMatrixAsync(res, matrix._Channel, matrix._Sport, matrix._Name, "Matrices").then(() => {
                        var header = this.modelFactory.ComposeMatrixHeader(matrix);
                        header.ThumbnailSource = thumbName.toString();
                        return this.storagefactory.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices").then((success) => {
                            return resolve(success)
                        });
                    });

                }).catch((err) => { return reject(err);});
        })

    }

    private GetThumbName(matrix) {
        var name: "thumbnail";
        matrix['Matrix.Children'].View.forEach(view => {
            if (name == undefined) {
                if (view.Content !== undefined) {
                    if (view.Content.Capture != undefined) {
                        console.log("enter........")
                        var kernel = view.Content.Capture._Kernel;
                        name = kernel.slice(0, -4).split(" ");
                        this.modelFactory.CreateThumbnail(kernel, name);
                    }
                }
            }
        });
        return name;
    }
}