import { Component } from '@angular/core';
import { StorageFactory } from '../../Factory/StorageFactory';
import { ModelFactory } from '../../Factory/ModelFactory';
import { AppVersion, File } from 'ionic-native';
import { Package } from '../../pages/Package';
import { DeleteHeader } from '../../Action/DeleteHeader';
import { OpenMatrix } from '../../Action/OpenMatrix';
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
declare var navigator: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [StorageFactory, ModelFactory, DeleteHeader, Package, OpenMatrix],
})
export class HomePage {

  selectedSegment: any;
  localMatrices = [];
  channels = [];
  Header = [];
  constructor(private http: Http, private platform: Platform, public navCtrl: NavController,
    private storagefactory: StorageFactory,
    private modelfactory: ModelFactory,
    private deleteHeader: DeleteHeader,
    private openmatrix: OpenMatrix,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private packages: Package
  ) {


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

  ionViewDidLoad() {
    console.log("main page");
  }

  // CreateSettingsAsync(){
  //   this.http.get(cordova.file.dataDirectory + "Server/User.json").map(res=>{

  //   }).catch((error:any) =>)

  // }

  DuplicateMatrix(channelName, matrixname) {
    var name = Date.now().toString();
    this.platform.ready().then(() => {
      this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices/" + matrixname + "/Header.xml")
        .subscribe(res => {
          var header = JSON.parse(res.text());
          header.Name = name;
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

  // Save(blob, filename) {
  //   File.createFile(cordova.file.dataDirectory, filename, true).then(() => {
  //     File.writeFile(cordova.file.dataDirectory, filename, blob, true).then(() => {

  //     })
  //   })
  // }

  //server header
  // SaveServerHeaders() {
  //   this.http.get(cordova.file.dataDirectory+"/matrix.xml").subscribe(data => {
  //     var headerList = JSON.parse(data.text());
  //     headerList.forEach(header => {
  //       var result = header;
  //       var item = {
  //         Title: result.Title, DateCreated: result.DateCreated, Name: result.UploadIndex.toString(), Channel: result.ChannelName,
  //         ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadIndex, Duration: result.Duration,
  //         Views: result.Views
  //       };
  //       this.Header.push(item);
  //     });
  //     this.SaveDownloadedHeaders(this.Header);
  //   })
  // }

  retrunThumbnailPath(name) {
    return cordova.file.applicationStorageDirectory + name + ".jpg";
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
          this.DownloadThumbnailfromServer(res.Channel, res.Name)
        })

    })
    // this.storagefactory.SaveRoamingHeader(Data, HeaderList.Channel, HeaderList.Sport, HeaderList.name);
  }
  DownloadThumbnailfromServer(channelName, matrixName) {
    this.packages.DownloadThumbnailfromServer(channelName, matrixName);
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
    // Observable.interval(6000)
    //   .take(1).map((x) => x + 5)
    //   .subscribe((x) => {
    //     this.deleteHeader.DeleteServerHeader(fileName, index, value, channelName);
    //     console.log("delete server header");
    //   })
    Observable.interval(7000)
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        this.platform.ready().then(() => {
          File.removeRecursively(cordova.file.dataDirectory, "Temp").then(() => {
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
    let popover = this.popoverCtrl.create(MoreActionsPopover);
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

  // For testing only --starts
  testOpenMatrix() {
    this.http.get("assets/matrix1.mtx")
      .subscribe(data => {
        var res = JSON.parse(data.text());

        if (this.platform.is('cordova')) {
          File.checkFile(cordova.file.applicationStorageDirectory, 'sample.mp4').then(_ => {
            console.log('Sample video already exists');
            this.testNavToEditor(res);
          }).catch(err => {

            File.checkFile(cordova.file.applicationDirectory + '/www/assets/', 'sample.mp4').then(_ => {

              File.copyFile(cordova.file.applicationDirectory + '/www/assets/', 'sample.mp4', cordova.file.applicationStorageDirectory, 'sample.mp4').then(_ => {
                console.log('Sample video saved to application directory');
                this.testNavToEditor(res);
              }).catch(err => {
                console.log('Failed saving video' + err);
                this.testNavToEditor(res);
              });

            }).catch(err => {
              console.log('Sample video not found in assets');
              this.testNavToEditor(res);
            });

          });
        }
        else {
          this.testNavToEditor(res);
        }

      });

  }

  testNavToEditor(data) {
    this.navCtrl.push(EditorPage, {
      matrixData: data.Matrix
    });
  }
  // For testing only --ends



  openMatrix(matrixName, Channel) {
    this.openmatrix.run(matrixName, Channel);
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
            this.deleteHeader.DeleteLocalHeader(DirName, index, channel);
            this.localMatrices.splice(index, 1);
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
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleteHeader.DeleteServerHeader(title, index, value, channel);
          value.splice(index, 1);
          this.channels.splice(index, 1);
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
export class MoreActionsPopover {

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
