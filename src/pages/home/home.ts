import { Component } from '@angular/core';

import { AppVersion } from 'ionic-native';

import { NavController, ActionSheetController, AlertController, PopoverController, ViewController } from 'ionic-angular';

import { EditorPage } from '../editor/editor';
import { SettingsPage } from '../settings/settings'
import { CollectionPage } from '../collection/collection'
import { ChannelCollectionPage } from '../channelcollection/channelcollection'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {

  selectedSegment: any;
  localMatrices: any;
  channels: any;

  constructor(public navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) {

    this.selectedSegment = "local";

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

    this.channels = [
      {
        title: 'Channel 1',
        channelMatrices: [
          { image: 'assets/icon/favicon.ico', title: 'Matrix 1' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 2' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 3' },
        ]
      },
      {
        title: 'Channel 2',
        channelMatrices: [
          { image: 'assets/icon/favicon.ico', title: 'Matrix 1' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 2' },
        ]
      },
      {
        title: 'Channel 3',
        channelMatrices: [
          { image: 'assets/icon/favicon.ico', title: 'Matrix 1' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 2' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 3' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 4' },
          { image: 'assets/icon/favicon.ico', title: 'Matrix 5' },
        ]
      },
    ];

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  newMatrix() {
    this.navCtrl.push(EditorPage, {
      firstPassed: 'New Matrix 1'
    });
  }

  openMatrix(title) {
    this.navCtrl.push(EditorPage, {
      firstPassed: title
    });
  }

  openCollection() {
    this.navCtrl.push(CollectionPage);
  }

  openChannelCollection(title) {
    this.navCtrl.push(ChannelCollectionPage, {
      firstPassed: title
    });
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

@Component({
  template: `
    <ion-list no-lines>
    <ion-item (click)="onAbout()">
      <ion-icon item-left name="information-circle"></ion-icon>About
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  versionNumber: any;
  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController) {
  }

  onAbout() {
    this.viewCtrl.dismiss();

    AppVersion.getVersionNumber().then((s) => {
      this.versionNumber = s;
    })

    let alert = this.alertCtrl.create({
      title: 'Sports PIP',
      subTitle: 'version:'+ this.versionNumber,
      buttons: ['OK']
    });
    alert.present();
  }
}
