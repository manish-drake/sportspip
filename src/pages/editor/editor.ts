import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, LoadingController, Events, PopoverController, ViewController } from 'ionic-angular';
import { MatrixInfoPage } from '../editor/matrixinfo/matrixinfo'
import { Compareview } from '../editor/compareview/compareview'
import { Swipeview } from '../editor/swipeview/swipeview';
import { Observable } from 'rxjs/Rx';
//Service
import { Logger } from '../../logging/logger';
import { Connection } from '../../Services/Connection'
import { Storage } from '../../Services/Factory/Storage';
import { ModelFactory } from '../../Services/Factory/ModelFactory';
//Action
import { AddView } from '../editor/action/addView';
import { DeleteView } from '../editor/action/deleteView';
import { AddCapture } from '../editor/action/addCapture';
import { AddPhoneCapture } from '../editor/action/addPhoneCapture';
import { AddIpCamCapture } from '../editor/action/addIpCamCapture';
import { SaveMatrix } from '../editor/action/saveMatrix';
import { AddCanvas } from '../editor/action/addCanvas';

declare var navigator: any;
@Injectable()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
  providers: [Connection, ModelFactory,
    AddView, SaveMatrix, DeleteView, AddCapture, AddPhoneCapture, AddCanvas, AddIpCamCapture],
})

export class EditorPage {

  selectedView: any;
  selectedViewIndex: number = 0;
  rootDirectory: any;
  matrix: any;
  views = [];

  constructor(public navCtrl: NavController,
    private storage: Storage,
    private addCanvas: AddCanvas,
    private addIpCamCapture: AddIpCamCapture,
    private addPhoneCapture: AddPhoneCapture,
    private addViewCmd: AddView,
    private dltView: DeleteView,
    private addCapture: AddCapture,
    private saveMatrices: SaveMatrix,
    private params: NavParams,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private modelFactory: ModelFactory,
    private platform: Platform,
    private connection: Connection,
    private events: Events,
    private popoverCtrl: PopoverController,
    private _logger: Logger) {

    this.storage.externalRootDirectory().then((res) => {
      this.rootDirectory = res;
    })

  }


  ionViewWillLoad() {
    this._logger.Debug('Editor page loaded');
    if (this.params.data != null) {
      this.matrix = this.params.data.matrixData;
      // console.log("editor page: " + this.matrix));
    }
    if (this.matrix["Matrix.Children"]["View"] instanceof Array) {
      this.views = this.matrix["Matrix.Children"]["View"];
    }
    else {
      this.views.push(this.matrix["Matrix.Children"]["View"]);
    }

    this.setSelectedView(this.views[0], this.selectedViewIndex);
  }

  ionViewWillEnter() {
    this._logger.Debug('Editor page Enter');
    this.setSelectedView(this.views[0], this.selectedViewIndex);
    this.evaluateCaptureViews();
  }

  presentMoreActions(event) {
    let popover = this.popoverCtrl.create(EditorActionsPopover, { countOfCaptureViews: this.countOfCaptureViews });
    popover.present({ ev: event });

    popover.onDidDismiss((data) => {
      if (data != null) {
        if (data == "compareviews") {
          this.openCompareView();
        }
        if (data == "swipeviews") {
          this.openSwipeView();
        }
      }
    });
  }

  presentInfoModal() {
    let modal = this.modalCtrl.create(MatrixInfoPage, {
      matrixData: this.matrix,
      viewsCount: this.views.length
    });

    modal.present();
  }

  showViewSegment(viewindex: number) {
    if (viewindex != this.selectedViewIndex) {
      this.selectedViewIndex = viewindex;
      this.events.publish('viewoutoffocus');
    }
  }

  setSelectedView(selectedView: any, viewindex: number) {
    if ((viewindex != this.selectedViewIndex) || (this.selectedView != selectedView)) {
      this.selectedView = selectedView;
      this.selectedViewIndex = viewindex;
      this.events.publish('viewoutoffocus');
    }
  }
  hideViewSegment(a, b) {
    if (a != b)
      return true;
  }

  saveMatrix() {
    if (this.platform.is('cordova')) {
      let loader = this.loadingCtrl.create({
        content: "Saving..",
        duration: 10000
      });
      loader.present();

      this.saveMatrices.run(this.matrix._Channel, this.matrix._Name, this.views)
        .catch(err => new Observable(err => {
          loader.dismiss();
          this._logger.Error("Error,Matrix file saving..", err);
          this.navCtrl.pop();
        }))
        .then((res) => {
          this.navCtrl.pop();
          loader.dismiss();
        })

    } else this.navCtrl.pop();
  }

  // Code for addView
  private _addView: AddView;
  public get addView(): AddView {
    return this.addViewCmd;
  }

  addViewSource() {
    return {
      "editor": this
    }
  }

  // Code for deleteView
  private _deleteView: DeleteView;
  public get deleteView(): DeleteView {
    return this.dltView;
  }

  deleteViewSource(i: Number) {
    return {
      "editor": this,
      "index": i
    };
  }

  //Code for add canvas

  private _addBlankCanvas: AddCanvas;
  public get addBlankCanvas(): AddCanvas {
    return this.addCanvas;
  }

  addCanvasSource() {
    return {
      "editor": this
    };
  }

  // Code for add Capture
  private _chooseVideo: AddCapture;
  public get chooseVideo(): AddCapture {
    return this.addCapture;
  }

  addCaptureSource() {
    return {
      "editor": this,
    };
  }

  // Code for Phone Camera Recording Starts
  private _recordVideo: AddPhoneCapture;
  public get recordVideo(): AddPhoneCapture {
    return this.addPhoneCapture;
  }

  addPhoneCaptureSource() {
    return {
      "editor": this,
    };
  }


  private _ipCamCapture: AddIpCamCapture;
  public get ipCamCapture(): AddIpCamCapture {
    return this.addIpCamCapture;
  }

  ipCamCaptureSource() {
    return {
      "matrix": this.matrix,
      "views": this.views,
      "selectedViewIndex": this.selectedViewIndex
    };
  }


  CreateVideoView(fileName, selectedViewIndex, source) {
    var localView = this.modelFactory.CreateVideoView(fileName, selectedViewIndex, source)
    this.views[this.selectedViewIndex] = localView;
    this.setSelectedView(localView, this.selectedViewIndex);
    this.evaluateCaptureViews();
  }
  //Code for ViewOptions end

  openCompareView() {
    var captureViews = [];
    this.views.forEach(view => {
      if (view.Content.Capture != undefined) {
        captureViews.push(view);
      }
    });
    console.log(captureViews);
    this.events.publish('viewoutoffocus');
    this.navCtrl.push(Compareview, {
      captureViews: captureViews
    });
  }

  countOfCaptureViews: number = 0;

  evaluateCaptureViews() {
    this.countOfCaptureViews = 0;
    this.views.forEach(element => {
      if (element.Content.Capture != undefined) {
        this.countOfCaptureViews++;
      }
    });
  }

  openSwipeView() {
    var captureViews = [];
    this.views.forEach(view => {
      if (view.Content.Capture != undefined) {
        captureViews.push(view);
      }
    });
    console.log(captureViews);
    this.navCtrl.push(Swipeview, {
      captureViews: captureViews
    });
  }
}

@Component({
  template: `
    <ion-list no-lines  style="margin:0;">
    <button ion-item [disabled]="countOfCaptureViews==0" (click)="dismiss('compareviews')">
      <ion-icon item-left name="grid"></ion-icon>Compare Views
      </button>
    </ion-list>
  `
})
// <button ion-item disabled (click)="dismiss('swipeviews')">
//       <ion-icon item-left name="move"></ion-icon>Swipe Views
//       </button>
export class EditorActionsPopover {

  countOfCaptureViews: any;

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    if (this.navParams.data != null) {
      this.countOfCaptureViews = this.navParams.data.countOfCaptureViews;
    }
  }

  dismiss(ev) {
    this.viewCtrl.dismiss(ev);
  }
}