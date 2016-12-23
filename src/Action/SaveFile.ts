import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { ModelFactory } from '../Factory/ModelFactory';
import { File } from 'ionic-native';
import { StorageFactory } from '../Factory/StorageFactory';
import { Observable } from 'rxjs/Rx';
import { Logger } from '../logging/logger';
declare var cordova: any;

@Injectable()
export class SaveFile {

    constructor(private platform: Platform, private storagefactory: StorageFactory, private modelFactory: ModelFactory, private _logger: Logger) {

    }

    isSaving: Boolean = false;
    private val: boolean = false;
    ionViewDidLoad() {
        if (this.val == true) this.isSaving = true;
        else this.isSaving = false;
    }

    saveMatrix(views, channel, matrixName) {
        this._logger.Debug('Save matrix..');
        try {
            this.val = true;
            this.ionViewDidLoad();
            if (this.platform.is('cordova')) {
                File.readAsText(cordova.file.dataDirectory + "Local/" + channel + "/Tennis/Matrices/" + matrixName, matrixName + ".mtx")
                    .then(data => {
                        var res = JSON.parse(data.toString());
                        var matrix = res.Matrix;
                        matrix['Matrix.Children'].View = views;

                        var thumbName = this.GetThumbName(matrix);

                        this.storagefactory.SaveMatrixAsync(res, matrix._Channel, matrix._Sport, matrix._Name, "Matrices");
                        var header = this.storagefactory.ComposeMatrixHeader(matrix);
                        header.ThumbnailSource = thumbName;
                        this.storagefactory.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices");

                        Observable.interval(500)
                            .take(1).map((x) => x + 5)
                            .subscribe((x) => {
                                this.val = false;
                                this.ionViewDidLoad();
                            })

                    });
            }
        }
        catch (err) {
            this._logger.Error('Error,saving matrix: ', err);
        }
    }

    private GetThumbName(matrix) {
        this._logger.Debug('Get thumbnail..');
        try {
            var thumb = "thumbnail";
            var name: any;
            matrix['Matrix.Children'].View.forEach(view => {
                if (name == undefined) {
                    if (view.Content !== undefined) {
                        if (view.Content.Capture != undefined) {
                            name = view.Content.Capture._Kernel;
                            thumb = Date.now().toString();
                            this.modelFactory.CreateThumbnail(name, thumb);
                        }
                    }
                }
            });
            return thumb;
        }
        catch (err) {
            this._logger.Error('Error,getting thumbnail: ', err);
        }
    }
}