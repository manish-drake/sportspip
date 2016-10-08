import { Component } from '@angular/core';

import { AppVersion } from 'ionic-native';

import { NavController, ActionSheetController, AlertController, PopoverController, ViewController } from 'ionic-angular';

import { Http } from '@angular/http';

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
    private alertCtrl: AlertController,
    private http: Http) {

    this.selectedSegment = "local";

    this.localMatrices = [
      { image: 'assets/sample.jpg', title: 'Matrix 2' },
      { image: 'assets/sample.jpg', title: 'Matrix 3' },
      { image: 'assets/sample.jpg', title: 'Matrix 4' },
      { image: 'assets/sample.jpg', title: 'Matrix 5' },
      { image: 'assets/sample.jpg', title: 'Matrix 6' },
      { image: 'assets/sample.jpg', title: 'Matrix 7' },
      { image: 'assets/sample.jpg', title: 'Matrix 8' },
      { image: 'assets/sample.jpg', title: 'Matrix 9' },
      { image: 'assets/sample.jpg', title: 'Matrix 10' },
      { image: 'assets/sample.jpg', title: 'Matrix 1' },
    ];

    this.channels = [
      {
        title: 'Channel 1',
        channelMatrices: [
          { image: 'assets/sample.jpg', title: 'Matrix 1' },
          { image: 'assets/sample.jpg', title: 'Matrix 2' },
          { image: 'assets/sample.jpg', title: 'Matrix 3' },
        ]
      },
      {
        title: 'Channel 2',
        channelMatrices: [
          { image: 'assets/sample.jpg', title: 'Matrix 1' },
          { image: 'assets/sample.jpg', title: 'Matrix 2' },
        ]
      },
      {
        title: 'Channel 3',
        channelMatrices: [
          { image: 'assets/sample.jpg', title: 'Matrix 1' },
          { image: 'assets/sample.jpg', title: 'Matrix 2' },
          { image: 'assets/sample.jpg', title: 'Matrix 3' },
          { image: 'assets/sample.jpg', title: 'Matrix 4' },
          { image: 'assets/sample.jpg', title: 'Matrix 5' },
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
      matrixData: 'New Matrix 1'
    });
  }

  openMatrix(title) {

    this.http.get("assets/matrix1.mtx")
      .subscribe(data => {
        var res = JSON.parse(data.text());
        var result = res.Matrix;

        this.navCtrl.push(EditorPage, {
          matrixData: result
        });
      });


  }

  matrixPressed(index, title) {
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

  openCollection() {
    this.navCtrl.push(CollectionPage);
  }

  openChannelCollection(title) {
    this.navCtrl.push(ChannelCollectionPage, {
      firstPassed: title
    });
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
      subTitle: 'version:' + this.versionNumber,
      buttons: ['OK']
    });
    alert.present();
  }
}
