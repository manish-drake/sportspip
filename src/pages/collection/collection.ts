import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { File } from 'ionic-native';
import { EditorPage } from '../editor/editor';
import { Package } from '../../pages/Package';
import { Http } from '@angular/http';
import { OpenMatrix } from '../../Action/OpenMatrix';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../../Factory/StorageFactory';
import { DeleteHeader } from '../../Action/DeleteHeader';
declare var cordova: any;

/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
  providers: [Package, OpenMatrix, StorageFactory, DeleteHeader],
})
export class CollectionPage {
  localMatrices = [];
  constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
    private deleteHeader: DeleteHeader,
    private storagefactory: StorageFactory,
    private openmatrix: OpenMatrix,
    private packages: Package,
    private platform: Platform, private http: Http) {
    this.LoadCollectionMatrix();
  }

  LoadCollectionMatrix() {

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

  FormatDate(value) {
    return this.packages.FormatDate(value);
  }

  formatDuration(dur) {
    return this.packages.FormatDuration(dur);
  }

  retrunThumbnailPath(name) {
    return "url(" + cordova.file.applicationStorageDirectory + name + ".jpg" + ")";
  }

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  openMatrix(matrixName, Channel) {
    this.openmatrix.run(matrixName, Channel);
  }

  DuplicateMatrix(matrixname, channelName) {
    var name = Date.now().toString();
    this.platform.ready().then(() => {
      this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices/" + matrixname + "/Header.xml")
        .subscribe(res => {
          var header = JSON.parse(res.text());
          header.Name = name;
          this.storagefactory.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices");
        })
      this.http.get(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices /" + matrixname + "/" + matrixname + ".mtx")
        .subscribe(res => {
          var matrix = JSON.parse(res.text());
          matrix.Matrix._Name = name;
          this.storagefactory.SaveMatrixAsync(matrix, channelName, matrix.Matrix._Sport, name, "Matrices");
        })
      Observable.interval(1000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.localMatrices = [];
          this.LoadCollectionMatrix();
        })
    })
  }

  matrixPressed(index, matrixName, channel, title) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteHeader.DeleteLocalHeader(matrixName, channel);
            this.localMatrices.splice(index, 1);
          }
        }, {
          text: 'Save Copy',
          handler: () => {
            this.DuplicateMatrix(matrixName, channel);
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

}
