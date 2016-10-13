import { Component } from '@angular/core';
import { StorageFactory } from '../../Factory/StorageFactory';
import { ModelFactory } from '../../Factory/ModelFactory';
import { AppVersion, File } from 'ionic-native';
import { Package } from '../../pages/Package';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';


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
      this.DisplayServerHeader();
    });

    //this.GetLocalMatrixHeader();
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
                    Title: result.Title, DateCreated: result.DateCreated, Name: "matrix1", Channel: result.Channel,
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
      this.packages.DownloadServerHeader(fileName, channelName);
      this.packages.MoveToLocalCollection();
    }
    //this.DeleteServerHeader(fileName, index, value, channelName);
    this.GetLocalMatrixHeader();
  }

  AuthenticateUser() {
    alert("Authenticatnig user");
    return true;
  }

  MoveToLocalCollection() {

    var headerPath = cordova.file.dataDirectory + "Temp/matrix1/Header.xml";
    this.http.get(headerPath).subscribe(data => {
      var result = JSON.parse(data.text());
      this.storagefactory.SaveLocalHeader(data.text(), result.Header.Channel, result.Header.Sport, "matrix1", "Matrices");
    })
    var matrixPath = cordova.file.dataDirectory + "Temp/matrix1/matrix1.xml";
    this.http.get(matrixPath).subscribe(data => {
      var result = JSON.parse(data.text());
      this.storagefactory.SaveMatrixAsync(data.text(), result.Matrix.Channel, result.Matrix.Sport, "matrix1", "Matrices");
    })
  }

  DownloadServerHeader(fileName, channelName) {
    this.platform.ready().then(() => {
      File.createDir(cordova.file.dataDirectory, "Temp", true).then(() => {
        var NewPath = cordova.file.dataDirectory + "Temp/";
        File.createDir(NewPath, "matrix1", true).then(() => {
          var matrixPath = NewPath + "matrix1/";
          var oldPath = cordova.file.dataDirectory + "Server/" + channelName + "/Tennis/Matrices/" + fileName + "/";
          File.copyFile(oldPath, "Header.xml", matrixPath, "Header.xml").then(() => {
            this.http.get("assets/matrix1.mtx")
              .subscribe(data => {
                File.createFile(matrixPath, "matrix1.xml", true).then(() => {
                  File.writeFile(matrixPath, "matrix1.xml", data.text(), true)
                    .then(function (success) {
                    })
                })
              })
          })
        })
      })
    })
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage1);
    popover.present({ ev: event });
  }

  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  newMatrix() {
    // this.navCtrl.push(EditorPage, {
    //   matrixData: 'New Matrix 1'
    // });

    this.http.get("assets/matrix1.mtx")
      .subscribe(data => {
        var res = JSON.parse(data.text());
        var result = res.Matrix;
        this.navCtrl.push(EditorPage, {
          matrixData: result
        });
      });

  }

  openMatrix(title) {
    this.platform.ready().then(() => {
      File.listDir(cordova.file.dataDirectory, "Local/").then((success) => {
        success.forEach((channelName) => {
          File.listDir(cordova.file.dataDirectory, "Local/" + channelName.name + "/Tennis/Matrices/").then((success) => {
            success.forEach((res) => {
              this.http.get(cordova.file.dataDirectory + "Local/" + channelName.name + "/Tennis/Matrices/" + res.name + "/" + res.name + ".mtx")
                .subscribe(data => {
                  var res = JSON.parse(data.text());
                  var result = res.Matrix;
                  this.navCtrl.push(EditorPage, {
                    matrixData: result
                  });
                });
            });
          });
        })
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
