import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
import { StorageFactory } from '../../../Factory/StorageFactory';
import { Package } from '../../../pages/Package';

declare var cordova: any;

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-matrixinfo',
    templateUrl: 'matrixinfo.html',
    providers: [StorageFactory, Package]
})

export class MatrixInfoPage {

    matrixData: any;

    formattedDateCreated: any;

    errorMessege: string;

    constructor(private viewCtrl: ViewController, navParams: NavParams,
        private storagefactory: StorageFactory,
        private packages: Package,
        private platform: Platform,
        private http: Http) {
        this.matrixData = navParams.get("matrixData");
        console.log(this.matrixData);
        this.errorMessege = "";
    }

    FormateDate(value) {
        return this.packages.FormatDate(value);
    }

    ionViewDidLoad() {
        console.log('Hello Matrixinfo Page');
    }

    ionViewWillUnload() {
        if (this.validatematrixInfo()) {
            this.platform.ready().then(() => {
                File.readAsText(cordova.file.dataDirectory + "Local/" + this.matrixData._Channel + "/Tennis/Matrices/" + this.matrixData._Name, this.matrixData._Name + ".mtx")
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
