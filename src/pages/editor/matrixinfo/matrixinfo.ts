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
  providers: [StorageFactory],
})

export class MatrixInfoPage {

  matrixData: any;

  formattedDateCreated: any;

  constructor(private viewCtrl: ViewController, navParams: NavParams,
    private storagefactory: StorageFactory,
    private platform: Platform,
    private http: Http) {
    this.matrixData = navParams.get("matrixData");
    console.log(this.matrixData);
  }

  getDateFromString(datestring) {
    return (new Date(parseInt(datestring))).toISOString();
  }

  ionViewDidLoad() {
    console.log('Hello Matrixinfo Page');
  }

  dismiss() {
    this.platform.ready().then(() => {
      console.log(this.matrixData.Channel);
      this.http.get(cordova.file.dataDirectory + "Local/" + this.matrixData.Channel + "/Tennis/matrices/" + this.matrixData._Name + "/" + this.matrixData._Name + ".mtx")
        .subscribe(data => {
          var res = JSON.parse(data.text());
          var matrix = res.Matrix;
          matrix._Title = this.matrixData._Title;
          matrix._Sport = this.matrixData._Sport;
          matrix._Skill = this.matrixData._Skill;
          matrix._Location = this.matrixData._Location;
          this.storagefactory.SaveMatrixAsync(res, matrix.Channel, matrix._Sport, matrix._Name, "matrices");
        });
    });
    this.viewCtrl.dismiss();
  }

}
