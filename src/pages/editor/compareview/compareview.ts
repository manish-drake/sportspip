import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Compareview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-compareview',
  templateUrl: 'compareview.html'
})
export class Compareview {

  views = [];

  compareSegment1: any;
  compareSegment2: any;

  selectedIndex: number = 0;

  constructor(public navCtrl: NavController, private navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('Hello Compareview Page');
    if (this.navParams.data) {
      this.views = this.navParams.data.captureViews;

      if (this.views.length == 1) {
        this.compareSegment1 = this.views[0];
        this.compareSegment2 = this.views[0];
      }
      else {
        this.compareSegment1 = this.views[0];
        this.compareSegment2 = this.views[1];
      }
    }
  }

  componentSelection(i) {
    this.selectedIndex = i;
  }

  playPause(ev) {
    
  }

}
