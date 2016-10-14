import { Component } from '@angular/core';
import { NavController, ActionSheetController,Platform } from 'ionic-angular';
import { File } from 'ionic-native';
import { EditorPage } from '../editor/editor';
import { Http } from '@angular/http';
declare var cordova: any;

/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html'
})
export class CollectionPage {
  localMatrices = [];
  constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController,private platform:Platform,private http:Http) {
    this.LoadColectionMatrix();
  }

  LoadColectionMatrix() {

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

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  openMatrix(title) {
    this.navCtrl.push(EditorPage, {
      firstPassed: title
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

}
