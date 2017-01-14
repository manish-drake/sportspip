import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { Package } from '../../Services/Package';
import { Duplicate } from '../../Services/Action/Duplicate';
import { OpenMatrix } from '../../Services/Action/OpenMatrix';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { DeleteHeader } from '../../Services/Action/DeleteHeader';
import { Logger } from '../../logging/logger';
import { Storage } from '../../Services/Factory/Storage';
import { Core } from '../../Services/core';
import { Utils } from '../../Services/common/utils';


/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
  providers: [OpenMatrix, DeleteHeader, Duplicate],
})
export class CollectionPage {
  localMatrices = [];
  dataDir: any;
  constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private core: Core,
    private utils: Utils,
    private deleteHeader: DeleteHeader,
    private duplicate: Duplicate,
    private storagefactory: StorageFactory,
    private openmatrix: OpenMatrix,
    private packages: Package,
    private platform: Platform,
    private _logger: Logger) {

    this.storage.externalDataDirectory().then((res) => {
      this.dataDir = res;
    })
    this.LoadCollectionMatrix();
  }

  refreshing: boolean = false;
  getSearchItems(ev: any) {
    this._logger.Debug('Get search items..');
    // Reset items back to all of the items
    this.localMatrices = [];
    this.LoadCollectionMatrix().then((res) => {
      // set val to the value of the searchbar
      let val = ev.target.value;
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.localMatrices = this.localMatrices.filter((item) => {
          return (item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    });
  }

  doRefreshContent(refresher) {
    this._logger.Debug('Refresh local collection content..');
    this.refreshing = true;
    this.localMatrices = [];
    setTimeout(() => {/*$Candidate for refactoring$*///why timeout?
      refresher.complete();
      this.LoadCollectionMatrix();
      this.refreshing = false;
    }, 500);
  }

  LoadCollectionMatrix() {
    this._logger.Debug('Getting local matrix collection..');
    return this.platform.ready().then(() => {
      return this.core.GetLocalHeader().then((res) => {
        this.localMatrices = res;
        return true;
      })
    });
  }

  FormatDate(value) {/*$Candidate for refactoring$*///Make standard
    return this.utils.FormatDate(value);
  }

  retrunThumbnailPath(name) {
    return "url(" + this.dataDir + name + ".jpg" + ")";
  }

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  private _OpenMatrix : OpenMatrix;
  public get OpenMatrix() : OpenMatrix {
    return this.openmatrix;
  }

  DuplicateMatrix(matrixname, channelName) {/*$Candidate for refactoring$*///Can go to actions=> "no"
    this._logger.Debug('Creating duplicate matrix..');
    this.platform.ready().then(() => {
      this.duplicate.Run(channelName, matrixname)
        .catch(err => new Observable(err => { this._logger.Error('Erro,Creating duplicate matrix..', err); }))
        .then((res) => {
          this.localMatrices = [];
          this.LoadCollectionMatrix();
        })
    })
  }

  matrixPressed(index, matrixName, channel, title) {/*$Candidate for refactoring$*///can go to actions="yes before that we have to make two different command and pressed action"
    this._logger.Debug('Matrix pressed (local collection..)');
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

}
