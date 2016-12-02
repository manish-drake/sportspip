import { Component } from '@angular/core';
import { File } from 'ionic-native';
import { StorageFactory } from '../../Factory/StorageFactory';
import { Http } from '@angular/http';
import { Package } from '../../pages/Package';
import { Observable } from 'rxjs/Rx';
import {
  NavController, ToastController, PopoverController, NavParams,
  ActionSheetController, AlertController, ViewController, Platform, LoadingController
} from 'ionic-angular';
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
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private popoverController: PopoverController,
    private packages: Package,
    private http: Http,
    private loadingCtrl: LoadingController) {

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
              var result = JSON.parse(data.text());
              // var result = header.Header;
              var item = {
                Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
                ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                Views: result.Clips
              };
              this.channelMatrices.push(item);
            });
        });

      });
    });

  }

  FormatDate(value) {
    return this.packages.FormatDate(value);
  }

  formatDuration(dur) {
    return this.packages.FormatDuration(dur);
  }

  retrunThumbnailPath(name) {
    return "url(" + cordova.file.applicationStorageDirectory + name + ".jpg" + ")";
  }

  presentPopover(event) {
    let popover = this.popoverController.create(PopoverPage2);
    popover.present({ ev: event });
  }

  DeleteChannelMatrix(DirName, Channel, index) {
    this.storagefactory.DeleteServerHeader(DirName, Channel);
    this.channelMatrices.splice(index, 1);
  }

  DownloadServerHeaderAsync(fileName, channelName, index) {
    let loader = this.loadingCtrl.create({
      content: 'Downloading..',
      duration: 300000
    });
    loader.present();

    var authenticate = this.AuthenticateUser();
    if (authenticate) {

      Observable.interval(2000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.DownloadServerHeader(fileName, channelName);
          console.log("Download");
        })

      Observable.interval(3000)
        .take(3).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.unzipPackage();
          console.log("unzip");
        })

      Observable.interval(5000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.MoveToLocalCollection(channelName);
          console.log("matrix moved");
        })
    }
    Observable.interval(7000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.DeleteChannelMatrix(fileName, channelName, index);
        console.log("delete server header");
        loader.dismiss();
      })

    Observable.interval(8000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.platform.ready().then(() => {
          File.removeRecursively("file:/storage/emulated/0/DCIM/", "Temp").then(() => {
            console.log("delete temp");
          });
        })
      })
  }

  AuthenticateUser() {
    console.log("Authenticatnig user..");
    return true;
  }

  channelMatrixClicked(index, channel, DirName, title) {
    let confirm = this.alertCtrl.create({
      title: ' Download Confirmation?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { console.log('Cancel clicked'); }
        },
        {
          text: 'Download',
          handler: () => {
            console.log('Download clicked');
            this.DownloadServerHeaderAsync(DirName, channel, index);
          }
        }
      ]
    });
    confirm.present();
  }

  channelMatrixPressed(index, channel, DirName, title) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [{
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
