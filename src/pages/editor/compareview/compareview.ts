import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,private navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('Hello Compareview Page');
    this.views = this.navParams.get('captureViews');
    console.log(this.views);
    this.views[0].checked = true;
  }

  componentSelection(i) {
        this.views.forEach((view, index) => {
            if (i != index)
                view.checked = false;
            else
                view.checked = true;
        });
    }

}
