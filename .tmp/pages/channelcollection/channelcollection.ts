import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController,AlertController } from 'ionic-angular';

/*
  Generated class for the Channelcollection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channelcollection',
  templateUrl: 'channelcollection.html'
})
export class ChannelCollectionPage {
  public firstParam: any;
  channelMatrices: any;
  constructor(public navCtrl: NavController, params: NavParams,
  private actionSheetCtrl:ActionSheetController,
  private alertCtrl:AlertController) {
    this.firstParam = params.get("firstPassed");

    this.channelMatrices = [
      { image: 'assets/sample.jpg', title: 'Matrix 1' },
      { image: 'assets/sample.jpg', title: 'Matrix 2' },
      { image: 'assets/sample.jpg', title: 'Matrix 3' },
      { image: 'assets/sample.jpg', title: 'Matrix 4' },
      { image: 'assets/sample.jpg', title: 'Matrix 5' },
      { image: 'assets/sample.jpg', title: 'Matrix 6' },
    ];
  }

  downloadMatrix() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Confirm!',
      buttons: [, {
        text: 'Download',
        handler: () => {
          let alert = this.alertCtrl.create({
            title: 'Not Downloaded!',
            subTitle: 'Download is not possible right now.',
            buttons: ['OK']
          });
          alert.present();
        }
      }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }

}
