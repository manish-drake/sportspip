import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditorPage } from '../editor/editor';

/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html'
})
export class CollectionPage {
  localMatrices:any;
  constructor(public navCtrl: NavController) {
    this.localMatrices = [
      { image: 'assets/icon/favicon.ico', title: 'Matrix 1' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 2' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 3' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 4' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 5' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 6' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 7' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 8' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 9' },
      { image: 'assets/icon/favicon.ico', title: 'Matrix 10' },
    ];
  }

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  openMatrix(title) {
    this.navCtrl.push(EditorPage, {
      firstPassed: title
    });
  }

}
