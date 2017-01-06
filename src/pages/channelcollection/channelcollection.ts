import { Component } from '@angular/core';
import { StorageFactory } from '../../Services/Factory/StorageFactory';

import { Storage } from '../../Services/Factory/Storage';
import { Package } from '../../Services/Package';
import { Observable } from 'rxjs/Rx';
import { AlertControllers } from '../../Services/Alerts';
import { Core } from '../../Services/core';
import {
  NavController, PopoverController, NavParams,
  ActionSheetController, AlertController, ViewController, Platform, LoadingController
} from 'ionic-angular';

import { Logger } from '../../logging/logger';


/*
  Generated class for the Channelcollection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-channelcollection',
  templateUrl: 'channelcollection.html',
})
export class ChannelCollectionPage {

  public channel: any;
  channelMatrices = [];
  TempMatrix = [];
  dataDir: any;

  constructor(public navCtrl: NavController, params: NavParams,
    private storage: Storage,
    private core: Core,
    private storagefactory: StorageFactory,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private alertCtrls: AlertControllers,
    private popoverController: PopoverController,
    private packages: Package,
    private loadingCtrl: LoadingController,
    private _logger: Logger) {
    this.dataDir = this.storage.externalDataDirectory();
    this.channel = params.get("firstPassed");
    this.GetChannelMatrix(this.channel);
  }

  refreshing: boolean = false;

  doRefreshContent(refresher) {
    this._logger.Debug('Refresh channel collection content..');
    this.refreshing = true;
    this.channelMatrices = [];
    setTimeout(() => {
      refresher.complete();
      this.GetChannelMatrix(this.channel);
      this.refreshing = false;
    }, 500);
  }

  GetChannelMatrix(channel) {
    this._logger.Debug('Get channel matrix..');
    this.platform.ready().then(() => {
      this.core.GetMatrixListByChannel(channel).then((res) => {
        this.channelMatrices = res;
      }).catch((err) => { this._logger.Error('Error,getting channel matrix: ', err); })
    });

  }

  getSearchItems(ev: any) {
    this._logger.Debug('Get search items (channel collection)..');
    // Reset items back to all of the items
    this.channelMatrices = [];
    this.channelMatrices = this.TempMatrix;

    Observable.interval(1000)/*$Candidate for refactoring$*///Please don't do this!!!
      .take(1).map((x) => x + 5)
      .subscribe((x) => {
        // set val to the value of the searchbar
        let val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
          this.channelMatrices = this.channelMatrices.filter((item) => {
            return (item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
      })
  }

  FormatDate(value) {/*$Candidate for refactoring$*///Is it a standard function? If yes, please take it to /services/common/utils.ts 
    return this.packages.FormatDate(value);
  }

  // formatDuration(dur) {
  //   return this.packages.FormatDuration(dur);
  // }

  retrunThumbnailPath(name) {/*$Candidate for refactoring$*///Is this function in use? remove if not..
    return "url(" + this.dataDir + name + ".jpg" + ")";
  }

  presentPopover(event) {
    let popover = this.popoverController.create(PopoverPage2);/*$Candidate for refactoring$*///Bad name - PopoverPage2. Please rename to something more meaningful
    popover.present({ ev: event });
  }

  DeleteChannelMatrix(DirName, Channel, index) {
    this.storagefactory.DeleteServerHeader(DirName, Channel);
    this.channelMatrices.splice(index, 1);
  }

  DownloadServerHeaderAsync(fileName, channelName, index) {/*$Candidate for refactoring$*///This function really needs SOME refactoring..
    this._logger.Debug('Download server header async..');
    try {
      let loader = this.loadingCtrl.create({
        content: 'Downloading..',
        duration: 300000
      });
      loader.present();

      var authenticate = this.AuthenticateUser();
      if (authenticate) {

        this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
          Observable.interval(2000)/*$Candidate for refactoring$*///BAD!!
            .take(3).map((x) => x + 5)
            .subscribe((x) => {
              this.packages.unzipPackage();
              console.log("unzip");
            })
          Observable.interval(4000)/*$Candidate for refactoring$*///BAD!!
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
              this.packages.MoveToLocalCollection(channelName);
              console.log("matrix moved");
            })
          Observable.interval(6000)/*$Candidate for refactoring$*///BAD!!
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
              this.storagefactory.RemoveFileAsync("file:/storage/emulated/0/DCIM", "Temp").subscribe(() => {
                this.DeleteChannelMatrix(fileName, channelName, index);
                console.log("delete server header");
                loader.dismiss();
              });
            })
        })

      }
    }
    catch (err) {
      this._logger.Error('Error,downloading server header async: ', err);
    }
  }

  AuthenticateUser() {
    console.log("Authenticatnig user..");
    return true;
  }

  channelMatrixClicked(index, channel, DirName, title) {
    this._logger.Debug('Channel matrix clicked..');
    try {
      let confirm = this.alertCtrl.create({/*$Candidate for refactoring$*///I see this code snippet used at many places elesewhere to create alert. Can't you create one function in /services/common/alerts.ts that can help create alerts from all the places?  
        title: ' Download Confirmation?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => { console.log('Cancel clicked'); }
          },
          {
            text: 'Download',
            handler: () => {
              console.log('Download clicked');
              this.DownloadServerHeaderAsync(DirName, channel, index);
            }
          }
        ]
      });
      confirm.present();
    }
    catch (err) {
      this._logger.Error('Error,Channel matrix clicked: ', err);
    }
  }

  channelMatrixPressed(index, channel, DirName, title) {
    this._logger.Debug('Channel matrix pressed..');
    try {
      let actionSheet = this.actionSheetCtrl.create({/*$Candidate for refactoring$*///same as the comment for alerts..
        title: title,
        buttons: [{
          icon: 'trash',
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.DeleteChannelMatrix(DirName, channel, index);
          }
        }, {
          icon: 'close',
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }
        ]
      });
      actionSheet.present();
    }

    catch (err) {
      this._logger.Error('Error,channel matrix pressed: ', err);
    }
  }
}
@Component({/*$Candidate for refactoring$*///Rename this class and take it to a separate file or justify why this class is hding here?
  template: `
    <ion-list radio-group (ionChange)="changeSortBy($event)">
      <ion-list-header>
        Sort By
      </ion-list-header>
      <ion-item>
        <ion-label>Date</ion-label>
        <ion-radio value="date" checked="true"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Title</ion-label>
        <ion-radio value="title"></ion-radio>
      </ion-item>
    </ion-list>
  `,
  selector: 'page-popover'
})

export class PopoverPage2 {

  constructor(public viewCtrl: ViewController) {

  }

  changeSortBy(event) {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
