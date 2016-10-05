import { Component, Input } from '@angular/core';
import { Factory } from '../../Factory/Factory';
import { AppVersion, File } from 'ionic-native';
import { Http, Headers, RequestOptions } from '@angular/http';
import {GroupBy} from '../../GroupBy/GroupBy';

import { NavController, ActionSheetController, AlertController, PopoverController, ViewController, Platform } from 'ionic-angular';

import { EditorPage } from '../editor/editor';
import { SettingsPage } from '../settings/settings';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
declare var cordova: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Factory],
})
export class HomePage {

  selectedSegment: any;
  localMatrices: any;
  channels = [];
  Header = [];
  items = [];


  constructor(private http: Http, private platform: Platform, public navCtrl: NavController,
    private factory: Factory,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) {

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

    // this.channels = [
    //   {
    //     title: 'Channel 1',
    //     channelMatrices: [
    //       { image: 'assets/sample.jpg', title: 'Matrix 1' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 2' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 3' },
    //     ]
    //   },
    //   {
    //     title: 'Channel 2',
    //     channelMatrices: [
    //       { image: 'assets/sample.jpg', title: 'Matrix 1' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 2' },
    //     ]
    //   },
    //   {
    //     title: 'Channel 3',
    //     channelMatrices: [
    //       { image: 'assets/sample.jpg', title: 'Matrix 1' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 2' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 3' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 4' },
    //       { image: 'assets/sample.jpg', title: 'Matrix 5' },
    //     ]
    //   },
    // ];

    this.GetserverHeader();
    this.DisplayHeader();
  }

  GetserverHeader() {

    this.http.get("assets/Header.xml")
      .subscribe(data => {
        this.SerializeServerData(data);
      })
  }

  SerializeServerData(headerData) {

    var res = JSON.parse(headerData.text());
    var result = res.Header;
    var item = {
      Title: result.Title, DateCreated: result.DateCreated, Name: "636046147357832112", Channel: result.Channel,
      ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
      Views: result.Clips
    };
    this.Header.push(item);
    this.SaveDownloadedHeaders(this.Header, headerData.text());

  }

  //Save Downloaded Header
  SaveDownloadedHeaders(HeaderList, Data) {

    HeaderList.forEach((res) => {
      this.factory.SaveRoamingHeader(Data, res.Channel, res.Sport, res.Name);
    })
  }

  //Display Server Header
  DisplayHeader() {

    this.platform.ready().then(() => {
      File.listDir(cordova.file.dataDirectory, "Server/Mayfair/Tennis/Matrices/").then((success) => {
        success.forEach((res) => {
          this.http.get(cordova.file.dataDirectory + "Server/Mayfair/Tennis/Matrices/" + res.name + "/Header.xml")
            .subscribe(data => {

              var jsonText = JSON.parse(data.text());
              var result = jsonText.Header;
              var item = {
                Title: result.Title, DateCreated: result.DateCreated, Name: res.name, Channel: result.Channel,
                ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                Views: result.Clips
              };
              this.channels.push(item);
            });
        });
      });
    });
  }

  //Deleted Server Header
  DeleteServerHeader(DirName, index) {
    this.factory.DeleteServerHeader(DirName);
    this.items.splice(index, 1);
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
      subTitle: 'version:' + this.versionNumber,
      buttons: ['OK']
    });
    alert.present();
  }
}
