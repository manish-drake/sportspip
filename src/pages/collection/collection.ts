import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform, ToastController, LoadingController, AlertController } from 'ionic-angular';
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
import { Upload } from '../../Services/Action/Upload';
import { DomSanitizer } from '@angular/platform-browser'

/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
  providers: [OpenMatrix, DeleteHeader, Duplicate, Upload],
})
export class CollectionPage {
  localMatrices = [];
  dataDir: any;
  constructor(public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private core: Core,
    private deleteHeader: DeleteHeader,
    private duplicate: Duplicate,
    private storagefactory: StorageFactory,
    private openmatrix: OpenMatrix,
    private packages: Package,
    private platform: Platform,
    private _logger: Logger,
    private upload: Upload,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) {

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
    return Utils.FormatDate(value);
  }

  returnThumbnailPath(name) {
    let filePath = this.dataDir + name + ".jpg";

    return "url(" + filePath + ")";
    // return this.sanitizer.bypassSecurityTrustUrl("url(" + filePath + ")");
  }

  ionViewDidLoad() {
    console.log('Hello Collection Page');
  }

  private _OpenMatrix: OpenMatrix;
  public get OpenMatrix(): OpenMatrix {
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

  matrixPressed(index, matrix) {/*$Candidate for refactoring$*///can go to actions="yes before that we have to make two different command and pressed action"
    this._logger.Debug('Matrix pressed (local collection..)');
    let actionSheet = this.actionSheetCtrl.create({
      title: matrix.Title,
      buttons: [
        {
          icon: 'cloud-upload',
          text: 'Upload',
          handler: () => {
            console.log('Upload clicked');
            this.UploadMatrix(matrix);
          }
        },
        {
          icon: 'copy',
          text: 'Save Copy',
          handler: () => {
            this.DuplicateMatrix(matrix.Name, matrix.Channel);
          }
        },
        // {
        //     icon: 'share-alt',
        //     text: 'Transfer',
        //     handler: () => {
        //         console.log('Transfer clicked');                       
        //     }
        // },
        {
          icon: 'trash',
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteHeader.DeleteLocalHeader(matrix.Name, matrix.Channel);
            this.localMatrices.splice(index, 1);
          }
        },
        {
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

  UploadMatrix(matrix) {
    this._logger.Debug('Uploading  matrix..');
    this.platform.ready().then(() => {
      matrix.Channel = "Channel1";
            const loader = this.loadingCtrl.create({
                content: "Uploading...",
            });
            loader.present();
            this.upload.Run(matrix)
                .then((res) => {
                    loader.dismiss();
                    this._logger.Debug('Matrix uploaded.')
                    const alert = this.alertCtrl.create({
                        title: 'Uploaded Successfully',
                        buttons: ['OK']
                    });
                    alert.present();
                })
                .catch(err => {
                    loader.dismiss();
                    this._logger.Error('Error uploading matrix: ', err);
                    let error: string = '';
                    if (err != undefined) {
                        'Error: ' + err;
                    }
                    const alert = this.alertCtrl.create({
                        title: 'Error uploading matrix!',
                        subTitle: error,
                        buttons: ['OK']
                    });
                    alert.present();
                });
    })
  }

}
