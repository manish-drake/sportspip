import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { File } from 'ionic-native';
import { Package } from '../../pages/Package';
import { Http } from '@angular/http';
import { OpenMatrix } from '../../Action/OpenMatrix';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../../Factory/StorageFactory';
import { DeleteHeader } from '../../Action/DeleteHeader';
import { Logger } from '../../logging/logger';
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
    private platform: Platform, private http: Http,
    private _logger:Logger) {
    this.LoadCollectionMatrix();
  }

  refreshing: boolean = false;

  getSearchItems(ev: any) {
    this._logger.Debug('Get search items..');
         try {
          // Reset items back to all of the items
          this.localMatrices = [];
          this.LoadCollectionMatrix();

          Observable.interval(1000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
              // set val to the value of the searchbar
              let val = ev.target.value;
              // if the value is an empty string don't filter the items
              if (val && val.trim() != '') {
                this.localMatrices = this.localMatrices.filter((item) => {
                  return (item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1);
                })
              }
            })
         }
         catch (err) {
            this._logger.Error('Error,getting search items: ', JSON.stringify(err));
         }
  }

  doRefreshContent(refresher) {
    this._logger.Debug('Refresh local collection content..');
         try {
            this.refreshing = true;
            this.localMatrices = [];
            setTimeout(() => {
              refresher.complete();
              this.LoadCollectionMatrix();
              this.refreshing = false;
            }, 500);
          }
         catch (err) {
            this._logger.Error('Error,refreshing local collection content: ', JSON.stringify(err));
         }
  }

  LoadCollectionMatrix() {
      this._logger.Debug('Load local matrix collection..');
         try {
            this.platform.ready().then(() => {
              File.listDir(cordova.file.dataDirectory, "Local/").then((success) => {
                success.forEach((channelName) => {
                  File.listDir(cordova.file.dataDirectory, "Local/" + channelName.name + "/Tennis/Matrices/").then((success) => {
                    success.forEach((res) => {
                      File.readAsText(cordova.file.dataDirectory + "Local/" + channelName.name + "/Tennis/Matrices/" + res.name, "Header.xml")
                        .then(data => {
                          //deserialiae server header  
                          var result = JSON.parse(data.toString());
                          // var result = header.Header;
                          var item = {
                            Title: result.Title, DateCreated: result.DateCreated, Name: result.Name, Channel: result.Channel,
                            ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                            Views: result.Views
                          };
                          this.localMatrices.push(item);
                        });
                    });
                  });
                })
              });
            });
         }
         catch (err) {
            this._logger.Error('Error,loading local matrix collection: ', JSON.stringify(err));
         }
  }

  FormatDate(value) {
    return this.packages.FormatDate(value);
  }

  retrunThumbnailPath(name) {
     this._logger.Debug('Retrun thumbnail path (local collection)..');
         try {
             return "url(" + cordova.file.applicationStorageDirectory + name + ".jpg" + ")";
          }
         catch (err) {
            this._logger.Error('Error,retruning thumbnail path (local collection): ', JSON.stringify(err));
         }
  }

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  openMatrix(matrixName, Channel) {
    this.openmatrix.run(matrixName, Channel);
  }

  DuplicateMatrix(matrixname, channelName) {
     this._logger.Debug('Creating duplicate matrix..');
         try {
            var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
            this.platform.ready().then(() => {
              File.readAsText(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices/" + matrixname, "Header.xml")
                .then(res => {
                  var header = JSON.parse(res.toString());
                  header.Name = name;
                  this.storagefactory.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices");
                })
              File.readAsText(cordova.file.dataDirectory + "Local/" + channelName + "/Tennis/Matrices /" + matrixname, matrixname + ".mtx")
                .then(res => {
                  var matrix = JSON.parse(res.toString());
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
         catch (err) {
            this._logger.Error('Error,creating duplicate matrix: ', JSON.stringify(err));
         }
  }

  matrixPressed(index, matrixName, channel, title) {
  this._logger.Debug('Matrix pressed (local collection..)');
         try {
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
         catch (err) {
            this._logger.Error('Error,matrix pressed (local collection): ', JSON.stringify(err));
         }
  }

}
