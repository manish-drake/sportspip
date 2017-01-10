import { Component } from '@angular/core';
import { Storage } from '../../Services/Factory/Storage';
import { Package } from '../../Services/Package';
import { Utils } from '../../Services/common/utils';
import { Observable } from 'rxjs/Rx';
import { AlertControllers } from '../../Services/Alerts';
import { Core } from '../../Services/core';
import { Download } from '../../Services/Action/Download';
import {
  NavController, PopoverController, NavParams,
  ActionSheetController, ViewController, Platform, LoadingController
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
  providers: [Download]
})
export class ChannelCollectionPage {

  public channel: any;
  channelMatrices = [];
  TempMatrix = [];
  dataDir: any;

  constructor(params: NavParams,
    private download: Download,
    private storage: Storage,
    private core: Core,
    private utils: Utils,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private popoverController: PopoverController,
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

  FormatDate(value) {
    return this.utils.FormatDate(value);
  }


  retrunThumbnailPath(name) {
    return "url(" + this.dataDir + name + ".jpg" + ")";
  }

  presentPopover(event) {
    let popover = this.popoverController.create(sortPopover);
    popover.present({ ev: event });
  }

  DeleteChannelMatrix(DirName, Channel, index) {
    this.core.DeleteServerHeader(DirName, Channel);
    this.channelMatrices.splice(index, 1);
  }

  private _downloadMatrix: Download;
  public get downloadMatrix(): Download {
    return this.download;
  }

  downloadMatrixSource(index, matrix) {
    return {
      "index": index,
      "matrix": matrix,
      "channelCollection":this
    }
  }

  channelMatrixPressed(index, matrix) {/*$Candidate for refactoring$*///can go to actions
    this._logger.Debug('Channel matrix pressed..');
    let actionSheet = this.actionSheetCtrl.create({/*$Candidate for refactoring$*///same as the comment for alerts..
      title: matrix.Title,
      buttons: [{
        icon: 'trash',
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.DeleteChannelMatrix(matrix.Name, matrix.Channel, index);
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

export class sortPopover {

  constructor(public viewCtrl: ViewController) {

  }

  changeSortBy(event) {
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
