import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '../../../Services/Factory/Storage';
import { Core } from '../../../Services/core';
import { Package } from '../../../Services/Package';
import { Logger } from '../../../logging/logger';
import { Utils } from '../../../Services/common/utils';
import { SettingsService } from '../../../Services/SettingsService';
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
    storageDataDir: string;

    constructor(private viewCtrl: ViewController, navParams: NavParams,
        private storage: Storage,
        private packages: Package,
        private platform: Platform,
        private core: Core,
        private _logger: Logger) {
        this.storage.externalDataDirectory().then((res) => {
            this.storageDataDir = res;
        });
        this.matrixData = navParams.get("matrixData");
        this.viewsCount = navParams.get("viewsCount");
        this.errorMessege = "";
    }

    FormateDate(value) {
        return Utils.FormatDate(value);
    }

    ionViewDidLoad() {
        console.log('Hello Matrixinfo Page');
        this._logger.Debug('Matrixinfo Page loaded');
    }


    ionViewWillUnload() {
        if (this.validatematrixInfo()) {
            this.core.ReadMatrixFile(this.storageDataDir + "Local/" + this.matrixData._Channel + "/Tennis/Matrices/" + this.matrixData._Name, this.matrixData._Name + ".mtx")
                .subscribe(data => {
                    var res = JSON.parse(data.toString());
                    var matrix = res.Matrix;
                    matrix._Title = this.matrixData._Title;
                    matrix._Sport = this.matrixData._Sport;
                    matrix._Skill = this.matrixData._Skill;
                    matrix._Location = this.matrixData._Location;
                    matrix._UniqueID  = this.matrixData._UniqueID;
                    this.core.SaveMatrixAsync(res, matrix._Channel, matrix._Sport, matrix._Name, "Matrices");
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
