import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Swipeview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-swipeview',
  templateUrl: 'swipeview.html'
})
export class Swipeview {

  views = [];

  constructor(public navCtrl: NavController,private navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('Hello Swipeview Page');
    this.views = this.navParams.get('captureViews');
  }

}
