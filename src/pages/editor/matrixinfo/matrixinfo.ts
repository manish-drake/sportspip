import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-matrixinfo',
  templateUrl: 'matrixinfo.html'
})
export class MatrixInfoPage {

  matrixData:any;

  formattedDateCreated:any;

  constructor(private viewCtrl: ViewController, navParams: NavParams ) {
    this.matrixData = navParams.get("matrixData");
    this.formattedDateCreated = (new Date(parseInt(this.matrixData.DateCreated))).toString();
  }

  ionViewDidLoad() {
    console.log('Hello Matrixinfo Page');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
