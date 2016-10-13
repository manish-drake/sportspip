import { Component } from '@angular/core';
import { File } from 'ionic-native';
import { StorageFactory } from '../../Factory/StorageFactory';
import { Http } from '@angular/http';
import { NavController, NavParams, ActionSheetController, AlertController, ViewController, Platform } from 'ionic-angular';
declare var cordova: any;

/*
  Generated class for the Channelcollection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channelcollection',
  templateUrl: 'channelcollection.html',
  providers: [StorageFactory],
})
export class ChannelCollectionPage {

  public channel: any;
  channelMatrices = [];

  constructor(public navCtrl: NavController, params: NavParams,
    private storagefactory: StorageFactory,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private http: Http) {

    this.channel = params.get("firstPassed");
    this.GetChannelMatrix(this.channel);
  }

  GetChannelMatrix(channel) {
    this.platform.ready().then(() => {
      File.listDir(cordova.file.dataDirectory, "Server/" + channel + "/Tennis/Matrices/").then((success) => {

        success.forEach((res) => {
          this.http.get(cordova.file.dataDirectory + "Server/" + channel + "/Tennis/Matrices/" + res.name + "/Header.xml")
            .subscribe(data => {
              //deserialiae server header  
              var header = JSON.parse(data.text());
              var result = header.Header;
              var item = {
                Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
                ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                Views: result.Clips
              };
              this.channelMatrices.push(item);

            });
        });

      });
    });

  }

  DeleteChannelMatrix(DirName, Channel, index) {
    this.storagefactory.DeleteServerHeader(DirName, Channel);
    this.channelMatrices.splice(index, 1);
  }

  channelMatrixPressed(index, channel, DirName) {
    let actionSheet = this.actionSheetCtrl.create({
      title: DirName,
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
          this.DeleteChannelMatrix(DirName, channel, index);
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
    <ion-list radio-group (ionChange)="changeSortBy()">
      <ion-list-header>
        Sort By
      </ion-list-header>
      <ion-item>
        <ion-label>Date</ion-label>
        <ion-radio value="date" checked="true"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Title</ion-label>
        <ion-radio value="title"></ion-radio>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage2 {
  constructor(public viewCtrl: ViewController) {
  }

  changeSortBy() {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
