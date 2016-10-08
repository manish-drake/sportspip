import { Component } from '@angular/core';
import { NavController,ActionSheetController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController,private actionSheetCtrl:ActionSheetController) {
    this.localMatrices = [
      { image: 'assets/sample.jpg', title: 'Matrix 1' },
      { image: 'assets/sample.jpg', title: 'Matrix 2' },
      { image: 'assets/sample.jpg', title: 'Matrix 3' },
      { image: 'assets/sample.jpg', title: 'Matrix 4' },
      { image: 'assets/sample.jpg', title: 'Matrix 5' },
      { image: 'assets/sample.jpg', title: 'Matrix 6' },
      { image: 'assets/sample.jpg', title: 'Matrix 7' },
      { image: 'assets/sample.jpg', title: 'Matrix 8' },
      { image: 'assets/sample.jpg', title: 'Matrix 9' },
      { image: 'assets/sample.jpg', title: 'Matrix 10' },
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

  matrixPressed(index,title) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        }, {
          text: 'Save Copy',
          handler: () => {
            console.log('Copy clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
