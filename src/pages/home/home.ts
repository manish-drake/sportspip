import { Component } from '@angular/core';
import { StorageFactory } from '../../Factory/StorageFactory';
import { ModelFactory } from '../../Factory/ModelFactory';
import { AppVersion, File } from 'ionic-native';
import { Package } from '../../pages/Package';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';


import { NavController, ActionSheetController, AlertController, PopoverController, ViewController, ToastController, Platform } from 'ionic-angular';

import { EditorPage } from '../editor/editor';
import { SettingsPage } from '../settings/settings';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
declare var cordova: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [StorageFactory, ModelFactory, Package],
})
export class HomePage {

  selectedSegment: any;
  localMatrices = [];
  channels = [];
  Header = [];
  constructor(private http: Http, private platform: Platform, public navCtrl: NavController,
    private storagefactory: StorageFactory,
    private modelfactory: ModelFactory,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private packages: Package
  ) {

    this.selectedSegment = "local";
    this.GetserverHeader().then((success) => {

      Observable.interval(1000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.DisplayServerHeader();
        })
    });

    this.GetLocalMatrixHeader();
  }

  GetLocalMatrixHeader() {
    this.platform.ready().then(() => {
      File.listDir(cordova.file.dataDirectory, "Local/").then((success) => {
        success.forEach((channelName) => {
          File.listDir(cordova.file.dataDirectory, "Local/" + channelName.name + "/Tennis/Matrices/").then((success) => {
            success.forEach((res) => {
              this.http.get(cordova.file.dataDirectory + "Local/" + channelName.name + "/Tennis/Matrices/" + res.name + "/Header.xml")
                .subscribe(data => {
                  //deserialiae server header  
                  var header = JSON.parse(data.text());
                  var result = header.Header;
                  var item = {
                    Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
                    ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                    Views: result.Clips
                  };
                  this.localMatrices.push(item);
                });
            });
          });
        })
      });
    });
  }

  DeleteLocalHeader(DirName, index, channel) {
    this.storagefactory.DeleteLocalHeader(DirName, channel);
    this.localMatrices.splice(index, 1);
  }

  GetserverHeader() {
    return this.http.get("assets/Header.xml")
      .map(res => {
        return this.SerializeServerData(res);
      }).toPromise()
  }

  SerializeServerData(headerData) {

    var res = JSON.parse(headerData.text());
    var result = res.Header;
    //  var item = {
    //       Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
    //       ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
    //       Views: result.Clips
    //     };
    //     this.Header.push(item);
    this.SaveDownloadedHeaders(result, headerData.text());

  }

  //Save Downloaded Header
  SaveDownloadedHeaders(HeaderList, Data) {

    // HeaderList.forEach((res) => {
    //   this.storagefactory.SaveRoamingHeader(res, res.Channel, res.Sport, res.Name);
    // })
    this.storagefactory.SaveRoamingHeader(Data, HeaderList.Channel, HeaderList.Sport, HeaderList.name);

  }

  //Display Server Header
  DisplayServerHeader() {
    this.platform.ready().then(() => {
      File.listDir(cordova.file.dataDirectory, "Server/").then((success) => {
        success.forEach((channelName) => {
          File.listDir(cordova.file.dataDirectory, "Server/" + channelName.name + "/Tennis/Matrices/").then((success) => {
            success.forEach((res) => {
              this.http.get(cordova.file.dataDirectory + "Server/" + channelName.name + "/Tennis/Matrices/" + res.name + "/Header.xml")
                .subscribe(data => {
                  //deserialiae server header  
                  var header = JSON.parse(data.text());
                  var result = header.Header;
                  var item = {
                    Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
                    ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                    Views: result.Clips
                  };
                  this.channels.push(item);
                });
            });
          });
        })
      });
    });
  }

  //Deleted Server Header
  DeleteServerHeader(DirName, index, value, channel) {
    this.storagefactory.DeleteServerHeader(DirName, channel);
    value.splice(index, 1);
    this.channels.splice(index, 1);
  }


  DownloadServerHeaderAsync(fileName, channelName, index, value) {
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
        this.localMatrices = [];
        this.GetLocalMatrixHeader();
      })
    Observable.interval(4000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.DeleteServerHeader(fileName, index, value, channelName);
      })


  }

  AuthenticateUser() {
    alert("Authenticatnig user");
    return true;
  }


  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage1);
    popover.present({ ev: event });
  }

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  newMatrix() {
    let data =
      `{
  "Matrix": {
    "name": "matrix1",
    "Name": "New Matrix 1",
    "Title": "New Matrix 1",
    "Skill": "Serve",
    "Location": "Field",
    "Duration": "00:00:00",
    "DateCreated": "20161010150719",
    "Sport": "Tennis",
    "Channel": "Local",
    "Matrix.Children": {
      "View": [
        {
          "name": "View 1",
          "Title": "View 1",
          "Source": "(Blank)",
          "Content": {}
        }
      ]
    }
  }
}`;
    var res = JSON.parse(data);
    var result = res.Matrix;

    console.log(result);

    this.navCtrl.push(EditorPage, {
      matrixData: result
    });
  }

  // For testing only
  testOpenMatrix() {
    this.http.get("assets/matrix1.mtx")
      .subscribe(data => {
        var res = JSON.parse(data.text());
        var result = res.Matrix;

        console.log(result);

        this.navCtrl.push(EditorPage, {
          matrixData: result
        });
      });
  }

  openMatrix(matrixName, Channel) {
    this.platform.ready().then(() => {
      this.http.get(cordova.file.dataDirectory + "Local/" + Channel + "/Tennis/Matrices/" + matrixName + "/" + matrixName + ".mtx")
        .subscribe(data => {
          var res = JSON.parse(data.text());
          var result = res.Matrix;
          this.navCtrl.push(EditorPage, {
            matrixData: result
          });
        });
    });
  }

  matrixPressed(index, DirName, channel) {
    let actionSheet = this.actionSheetCtrl.create({
      title: DirName,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.DeleteLocalHeader(DirName, index, channel);
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


  openChannelCollection(channel) {
    this.navCtrl.push(ChannelCollectionPage, {
      firstPassed: channel
    });
  }
  channelMatrixPressed(index, title, value, channel) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [{
        text: 'Download',
        handler: () => {
          this.DownloadServerHeaderAsync(title, channel, index, value);
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
          this.DeleteServerHeader(title, index, value, channel);
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
export class PopoverPage1 {
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
