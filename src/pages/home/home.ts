import { Component } from '@angular/core';
import { StorageFactory } from '../../Factory/StorageFactory';
import { ModelFactory } from '../../Factory/ModelFactory';
import { AppVersion, File } from 'ionic-native';
import { Package } from '../../pages/Package';
import { Http } from '@angular/http';
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
    console.log("main page");

    this.selectedSegment = "local";

    //for local url

    this.GetserverHeader().then((success) => {
      Observable.interval(1000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.DisplayServerHeader();
        })
    });

    //for server url

    // this.GetserverHeader().then(success => {
    //   Observable.interval(1000)
    //     .take(1).map((x) => x + 5)
    //     .subscribe((x) => {
    //       this.SaveServerHeaders();
    //     })
    //      Observable.interval(2000)
    //     .take(1).map((x) => x + 5)
    //     .subscribe((x) => {
    //       this.DisplayServerHeader();
    //     })    
    // });

    this.GetLocalMatrixHeader();
  }


  DuplicateMatrix(channelName, matrixname) {
    var name = Date.now().toString();
    this.platform.ready().then(() => {
      this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices/" + matrixname + "/Header.xml")
        .subscribe(res => {
          var header = JSON.parse(res.text());
          header.name = name;
          this.storagefactory.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices");
        })
      this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/matrices/" + matrixname + "/" + matrixname + ".mtx")
        .subscribe(res => {
          var matrix = JSON.parse(res.text());
          matrix.Matrix._Name = name;
          this.storagefactory.SaveMatrixAsync(matrix, channelName, matrix.Matrix._Sport, name, "Matrices");
        })
      Observable.interval(1000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.localMatrices = [];
          this.GetLocalMatrixHeader();
        })
    })
  }



  GetserverHeader() {

    //local
    return this.http.get("assets/Header.xml")
      .map(res => {
        return this.SerializeServerData(res);
      }).toPromise()

    //server
    // return this.http.get("http://sportspip.cloudapp.net:10101/IStorageService/getmtxhdrs")
    //   .map(res => {
    //     var headerData = JSON.parse(res.text());
    //     this.Save(headerData, "header.xml");
    //   }).toPromise();
  }

  Save(blob, filename) {
    File.createFile(cordova.file.dataDirectory, filename, true).then(() => {
      File.writeFile(cordova.file.dataDirectory, filename, blob, true).then(() => {

      })
    })
  }

  SaveServerHeaders() {
    this.http.get("file:/storage/emulated/0/DCIM/matrix/matrix.xml").subscribe(data => {
      var headerList = JSON.parse(data.text());
      headerList.forEach(header => {
        var result = header;
        var item = {
          Title: result.Title, DateCreated: result.DateCreated, Name: result.UploadIndex.toString(), Channel: result.ChannelName,
          ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadIndex, Duration: result.Duration,
          Views: result.Views
        };
        this.Header.push(item);
      });
      this.SaveDownloadedHeaders(this.Header);
    })
  }

  SerializeServerData(headerData) {

    var res = JSON.parse(headerData.text());
    var result = res.Header;
    var item = {
      Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
      ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
      Views: result.Clips
    };
    this.Header.push(item);
    this.SaveDownloadedHeaders(this.Header);

  }

  //Save Downloaded Header
  SaveDownloadedHeaders(HeaderList) {
    HeaderList.forEach((res) => {
      Observable.interval(2000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.storagefactory.SaveRoamingHeader(res, res.Channel, res.Sport, res.Name);
        })

    })
    // this.storagefactory.SaveRoamingHeader(Data, HeaderList.Channel, HeaderList.Sport, HeaderList.name);

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
                  var result = JSON.parse(data.text());
                  // var result = header.Header;
                  var item = {
                    Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
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

  //Display Server Header
  DisplayServerHeader() {
    this.platform.ready().then(() => {
      File.listDir(cordova.file.dataDirectory, "Server/").then((success) => {
        success.forEach((channelName) => {
          File.listDir(cordova.file.dataDirectory, "Server/" + channelName.name + "/Tennis/Matrices/").then((success) => {
            success.forEach((res) => {
              this.http.get(cordova.file.dataDirectory + "Server/" + channelName.name + "/Tennis/Matrices/" + res.name + "/Header.xml")
                .subscribe(data => {
                  // deserialiae server header  
                  var result = JSON.parse(data.text());
                  var item = {
                    Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
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
          console.log("Download");
        })

      Observable.interval(2000)
        .take(3).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.unzipPackage();
          console.log("unzip");
        })

      Observable.interval(4000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.packages.MoveToLocalCollection(channelName);
          console.log("matrix moved");
        })
    }
    Observable.interval(5000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.localMatrices = [];
        this.GetLocalMatrixHeader();
        console.log("local header");
      })
    Observable.interval(6000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.DeleteServerHeader(fileName, index, value, channelName);
        console.log("delete server header");
      })
    Observable.interval(7000)
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
    let toast = this.toastCtrl.create({
      message: 'Authenticatnig user..',
      duration: 2000,
    });
    toast.present();
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
    "_name": "matrix1",
    "_Name": "New Matrix 1",
    "_Title": "New Matrix 1",
    "_Skill": "Serve",
    "_Location": "Field",
    "_Duration": "00:00:00",
    "_DateCreated": "20161010150719",
    "_Sport": "Tennis",
    "_Channel": "Local",
    "Matrix.Children": {
      "View":
        {
          "_name": "View 1",
          "_Title": "View 1",
          "_Source": "(Blank)",
          "_Content": {}
        }
    }
  }
}`;
    var res = JSON.parse(data);
    var result = res.Matrix;

    this.navCtrl.push(EditorPage, {
      matrixData: result
    });
  }

  // For testing only
  testOpenMatrix() {
    this.http.get("assets/matrix1.mtx")
      .subscribe(data => {
        console.log(data.text());
        console.log(data['_data']);
        var res = JSON.parse(data.text());
        this.navCtrl.push(EditorPage, {
          matrixData: res.Matrix
        });
      });
  }

  openMatrix(matrixName, Channel) {
    this.platform.ready().then(() => {
      this.http.get(cordova.file.dataDirectory + "Local/" + Channel + "/Tennis/matrices/" + matrixName + "/" + matrixName + ".mtx")
        .subscribe(data => {
          console.log("open matrix");
          var res = JSON.parse(data.text());
          this.navCtrl.push(EditorPage, {
            matrixData: res.Matrix
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
            this.DuplicateMatrix(channel, DirName);
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
    console.log(channel);
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

  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, private platform: Platform, ) {
    if (this.platform.is('cordova')) {
      AppVersion.getVersionNumber().then((s) => {
        this.versionNumber = s;
      })
    }
  }

  onAbout() {
    this.viewCtrl.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Sports PIP',
      subTitle: 'version ' + this.versionNumber,
      buttons: ['OK']
    });
    alert.present();
  }
}
