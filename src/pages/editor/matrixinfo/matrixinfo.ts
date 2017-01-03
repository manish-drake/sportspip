import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { Package } from '../../../Services/Package';
import { Logger } from '../../../logging/logger';

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-matrixinfo',
    templateUrl: 'matrixinfo.html',
    providers: [Package]
})

export class MatrixInfoPage {

    matrixData: any;
    viewsCount: number;

    errorMessege: string;

    constructor(private viewCtrl: ViewController, navParams: NavParams,
        private storagefactory: StorageFactory,
        private packages: Package,
        private platform: Platform,
        private http: Http,
        private _logger: Logger) {
        this.matrixData = navParams.get("matrixData");
        this.viewsCount = navParams.get("viewsCount");
        this.errorMessege = "";
    }

    FormateDate(value) {
        return this.packages.FormatDate(value);
    }

    ionViewDidLoad() {
        console.log('Hello Matrixinfo Page');
        this._logger.Debug('Matrixinfo Page loaded');
    }


    ionViewWillUnload() {
        if (this.validatematrixInfo()) {
            this.platform.ready().then(() => {
                this.storagefactory.ReadMatixFileAync("Local", this.matrixData._Channel, this.matrixData._Name, this.matrixData._Name + ".mtx")
                    .then(data => {
                        var res = JSON.parse(data.toString());
                        var matrix = res.Matrix;
                        matrix._Title = this.matrixData._Title;
                        matrix._Skill = this.matrixData._Skill;
                        matrix._Location = this.matrixData._Location;
                        this.storagefactory.SaveMatrixAsync(res, matrix._Channel, matrix._Sport, matrix._Name, "Matrices");
                    });
            });
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    validatematrixInfo() {
        if (!this.matrixData._Title || !this.matrixData._Sport) {
            if (!this.matrixData._Title) this.errorMessege = "Title Required";
            else if (!this.matrixData._Sport) this.errorMessege = "Sport Required";
            return false;
        }
        else {
            this.errorMessege = "";
            return true;
        }
    }
}
