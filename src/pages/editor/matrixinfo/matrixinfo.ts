import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { Http } from '@angular/http';

import { StorageFactory } from '../../../Factory/StorageFactory';

declare var cordova: any;

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-matrixinfo',
    templateUrl: 'matrixinfo.html',
    providers: [StorageFactory]
})

export class MatrixInfoPage {

    matrixData: any;

    formattedDateCreated: any;

    errorMessege: string;

    constructor(private viewCtrl: ViewController, navParams: NavParams,
        private storagefactory: StorageFactory,
        private platform: Platform,
        private http: Http) {
        this.matrixData = navParams.get("matrixData");
        console.log(this.matrixData);
        this.errorMessege = "";
    }

    FormateDate(value) {
        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        var date = new Date(value.replace(pattern, '$1-$2-$3 $4:$5:$6'));
        return date.toDateString();
    }

    ionViewDidLoad() {
        console.log('Hello Matrixinfo Page');
    }

    dismiss() {
        if (this.validatematrixInfo()) {
            this.platform.ready().then(() => {
                console.log(this.matrixData.Channel);
                this.http.get(cordova.file.dataDirectory + "Local/" + this.matrixData.Channel + "/Tennis/Matrices/" + this.matrixData._Name + "/" + this.matrixData._Name + ".mtx")
                    .subscribe(data => {
                        var res = JSON.parse(data.text());
                        var matrix = res.Matrix;
                        matrix._Title = this.matrixData._Title;
                        matrix._Sport = this.matrixData._Sport;
                        matrix._Skill = this.matrixData._Skill;
                        matrix._Location = this.matrixData._Location;
                        this.storagefactory.SaveMatrixAsync(res, matrix.Channel, matrix._Sport, matrix._Name, "Matrices");
                    });
            });
            this.viewCtrl.dismiss();
        }
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
