import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { Core } from '../../../Services/core';
import { Logger } from '../../../logging/logger';
import { Storage } from '../../../Services/Factory/Storage';
import { ModelFactory } from '../../../Services/Factory/ModelFactory';

@Injectable()
export class SaveMatrix {
    storageDataDir: string;
    constructor(private storage: Storage, private modelFactory: ModelFactory, private _logger: Logger, private core: Core) {
        this.storageDataDir = this.storage.externalDataDirectory();
    }
    run(channel, matrixName, views): Promise<any> {
        this._logger.Debug("Matrix file saving..")
        return new Promise((resolve, reject) => {
            return this.core.ReadMatrixFile(this.storageDataDir + "Local/" + channel + "/Tennis/Matrices/" + matrixName, matrixName + ".mtx")
                .subscribe((data) => {
                    var res = JSON.parse(data.toString());
                    var matrix = res.Matrix;
                    matrix['Matrix.Children'].View = views;
                    var thumbName = this.GetThumbName(matrix);
                    return this.core.SaveMatrixAsync(res, matrix._Channel, matrix._Sport, matrix._Name, "Matrices").then(() => {
                        var header = this.modelFactory.ComposeMatrixHeader(matrix);
                        header.ThumbnailSource = thumbName.toString();
                        return this.core.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices").then((success) => {
                            return resolve(success)
                        });
                    });

                })
        })

    }

    private GetThumbName(matrix) {
        var name = "thumbnail";
        matrix['Matrix.Children'].View.forEach(view => {
            if (view.Content !== undefined) {
                if (view.Content.Capture != undefined) {
                    console.log("enter........")
                    var kernel = view.Content.Capture._Kernel;
                    name = kernel.slice(0, -4).split(" ");
                    this.modelFactory.CreateThumbnail(kernel, name);
                     return name;
                }
            }
        });
        return name;
    }
}