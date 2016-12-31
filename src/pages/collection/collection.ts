import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { Package } from '../../Services/Package';
import { Http } from '@angular/http';
import { Duplicate } from '../../Services/Action/Duplicate';
import { OpenMatrix } from '../../Services/Action/OpenMatrix';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { DeleteHeader } from '../../Services/Action/DeleteHeader';
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
  providers: [Package, OpenMatrix, StorageFactory, DeleteHeader, Duplicate],
})
export class CollectionPage {
  localMatrices = [];
  constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
    private deleteHeader: DeleteHeader,
    private duplicate: Duplicate,
    private storagefactory: StorageFactory,
    private openmatrix: OpenMatrix,
    private packages: Package,
    private platform: Platform, private http: Http,
    private _logger: Logger) {
    this.LoadCollectionMatrix();
  }

  refreshing: boolean = false;

  getSearchItems(ev: any) {
    this._logger.Debug('Get search items..');
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

  doRefreshContent(refresher) {
    this._logger.Debug('Refresh local collection content..');
    this.refreshing = true;
    this.localMatrices = [];
    setTimeout(() => {
      refresher.complete();
      this.LoadCollectionMatrix();
      this.refreshing = false;
    }, 500);
  }

  LoadCollectionMatrix() {
    this._logger.Debug('Getting local matrix collection..');
    this.platform.ready().then(() => {
      this.storagefactory.GetLocalHeader().then((res) => {
        this.localMatrices = res;
      })
    });
  }

  FormatDate(value) {
    return this.packages.FormatDate(value);
  }

  retrunThumbnailPath(name) {
    return "url(" + cordova.file.externalDataDirectory + name + ".jpg" + ")";
  }

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  openMatrix(matrixName, Channel) {
    this.openmatrix.run(matrixName, Channel);
  }

  DuplicateMatrix(matrixname, channelName) {
    this._logger.Debug('Creating duplicate matrix..');
    this.platform.ready().then(() => {
      this.duplicate.Run(channelName, matrixname).then((res) => {
        this.localMatrices = [];
        this.LoadCollectionMatrix();
      }).catch((err) => { this._logger.Error('Erro,Creating duplicate matrix..', err); });
    })
  }

  matrixPressed(index, matrixName, channel, title) {
    this._logger.Debug('Matrix pressed (local collection..)');
    try {
      let actionSheet = this.actionSheetCtrl.create({
        title: title,
        buttons: [
          {
            icon: 'trash',
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.deleteHeader.DeleteLocalHeader(matrixName, channel);
              this.localMatrices.splice(index, 1);
            }
          }, {
            icon: 'copy',
            text: 'Save Copy',
            handler: () => {
              this.DuplicateMatrix(matrixName, channel);
            }
          }, {
            icon: 'close',
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
      this._logger.Error('Error,matrix pressed (local collection): ', err);
    }
  }

}
