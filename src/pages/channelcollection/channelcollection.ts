import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, PopoverController, ViewController } from 'ionic-angular';

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
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController) {
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

  presentPopover() {
    let popover = this.popoverCtrl.create(PopoverPage2);
    popover.present();
  }

  channelMatrixPressed(index, title) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [{
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
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          console.log('Destructive clicked');
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

@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
      Sort By
    </ion-title>
  </ion-toolbar>
</ion-header>
    <ion-content>
    <ion-list radio-group>
      <ion-list-header>Sort By</ion-list-header>
      <ion-item>
        <ion-label>Date</ion-label>
        <ion-radio value="date"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Title</ion-label>
        <ion-radio value="title"></ion-radio>
      </ion-item>
    </ion-list>
    </ion-content>
  `
})
export class PopoverPage2 {
  constructor(public viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
