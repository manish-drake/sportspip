import { Component } from '@angular/core';
import { File } from 'ionic-native';
import { StorageFactory } from '../../Factory/StorageFactory';
import { Http } from '@angular/http';
import { Package } from '../../pages/Package';
import { Observable } from 'rxjs/Rx';
import { NavController, PopoverController, NavParams, ActionSheetController, AlertController, ViewController, Platform } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
declare var cordova: any;

/*
  Generated class for the Channelcollection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channelcollection',
  templateUrl: 'channelcollection.html',
  providers: [StorageFactory, Package],
})
export class ChannelCollectionPage {

  public channel: any;
  channelMatrices = [];

  constructor(public navCtrl: NavController, params: NavParams,
    private storagefactory: StorageFactory,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private popoverController: PopoverController,
    private packages: Package,
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

  presentPopover(event) {
    let popover = this.popoverController.create(PopoverPage2);
    popover.present({ ev: event });
    alert("Sss");
  }

  DeleteChannelMatrix(DirName, Channel, index) {
    this.storagefactory.DeleteServerHeader(DirName, Channel);
    this.channelMatrices.splice(index, 1);
  }

  DownloadServerHeaderAsync(fileName, channelName, index) {
    var authenticate = this.AuthenticateUser();
    if (authenticate) {
      Observable.interval(1000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.DownloadServerHeader(fileName, channelName);
        })
      Observable.interval(2000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.MoveToLocalCollection();
        })
    }
    Observable.interval(3000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
      })
    Observable.interval(4000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.DeleteChannelMatrix(fileName, channelName, index);
      })


  }

  AuthenticateUser() {
    alert("Authenticatnig user");
    return true;
  }

  channelMatrixPressed(index, channel, DirName) {
    let actionSheet = this.actionSheetCtrl.create({
      title: DirName,
      buttons: [{
        text: 'Download',
        handler: () => {
          this.DownloadServerHeaderAsync(DirName, channel, index);
          // let alert = this.alertCtrl.create({
          //   title: 'Not Downloaded!',
          //   subTitle: 'Download is not possible right now.',
          //   buttons: ['OK']
          // });
          // alert.present();
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
    <ion-list radio-group (ionChange)="changeSortBy($event)">
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
  `,
  selector: 'page-popover'
})

export class PopoverPage2 {

  constructor(public viewCtrl: ViewController) {

  }

  changeSortBy(event) {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
