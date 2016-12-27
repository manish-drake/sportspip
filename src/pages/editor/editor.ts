import { Component, Injectable } from '@angular/core';

import {
  NavController, NavParams, AlertController, ModalController, ModalOptions, Platform,
  App, LoadingController, Events, PopoverController, ViewController
} from 'ionic-angular';
import { BackGroundTransferProcess } from '../../Action/BackGroundTransferProcess';
import { File, FileChooser, MediaCapture, CaptureVideoOptions, MediaFile, CaptureError, FilePath } from 'ionic-native';
import { AlertControllers } from '../../Action/Alerts';
import { Http } from '@angular/http';
import { Connection } from '../../pages/Connection'
import { StorageFactory } from '../../Factory/StorageFactory';
import { ModelFactory } from '../../Factory/ModelFactory';
import { Observable } from 'rxjs/Rx';
import { MatrixInfoPage } from '../editor/matrixinfo/matrixinfo'
import { Compareview } from '../editor/compareview/compareview'
import { Swipeview } from '../editor/swipeview/swipeview'
import { Ipcameras } from '../editor/ipcameras/ipcameras'
import { Logger } from '../../logging/logger';
declare var navigator: any;
declare var cordova: any;

@Injectable()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
  providers: [StorageFactory, Connection, ModelFactory, BackGroundTransferProcess],
})

export class EditorPage {

  selectedViewIndex: number;

  matrix: any;
  views = [];

  constructor(public navCtrl: NavController,
    private backGroundTransferProcess: BackGroundTransferProcess,
    private params: NavParams,
    private alertCtrls: AlertControllers,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private modelFactory: ModelFactory,
    private platform: Platform,
    private connection: Connection,
    private http: Http,
    private storagefactory: StorageFactory,
    private app: App,
    private events: Events,
    private popoverCtrl: PopoverController,
    private _logger: Logger) {
    // if (params.data != null) {
    //   this.matrix = params.data.matrixData;
    //   console.log("editor page: " + this.matrix);
    // }

    // this.platform.registerBackButtonAction(() => {
    //   let view = this.navCtrl.getActive();
    //   if (view.instance instanceof EditorPage) this.saveMatrix();
    //   else this.navCtrl.pop();
    // });    
  }


  ionViewWillLoad() {
    this._logger.Debug('Editor page loaded');
    if (this.params.data != null) {
      this.matrix = this.params.data.matrixData;
      // console.log("editor page: " + this.matrix));
    }

    this.selectedViewIndex = 0;
    if (this.matrix["Matrix.Children"]["View"] instanceof Array) {
      this.views = this.matrix["Matrix.Children"]["View"];
    }
    else {
      this.views.push(this.matrix["Matrix.Children"]["View"]);
    }
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

  saveMatrix() {
    if (this.platform.is('cordova')) {

      let loader = this.loadingCtrl.create({
        content: "Saving..",
        duration: 10000
      });
      loader.present();

      this.storagefactory.ReadFileAync("Local", this.matrix._Channel, this.matrix._Name, this.matrix._Name + ".mtx")
        .then((data) => {
          this._logger.Debug("Matrix file saving..")

          var res = JSON.parse(data.toString());
          var matrix = res.Matrix;
          matrix['Matrix.Children'].View = this.views;
          var thumbName = this.GetThumbName(matrix);
          this.storagefactory.SaveMatrixAsync(res, matrix._Channel, matrix._Sport, matrix._Name, "Matrices");
          var header = this.storagefactory.ComposeMatrixHeader(matrix);
          header.ThumbnailSource = thumbName.toString();
          this.storagefactory.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices");

          Observable.interval(1000)
            .take(1).map((x) => x + 5)
            .subscribe((x) => {
              this.navCtrl.pop();
              loader.dismiss();
            });
        }).catch((err) => { 
          this._logger.Error("Error,Matrix file saving..", err); this.navCtrl.pop();
          loader.dismiss();
         });

    } else this.navCtrl.pop();
  }

  GetThumbName(matrix) {
    var name: "thumbnail";
    matrix['Matrix.Children'].View.forEach(view => {
      if (name == undefined) {
        if (view.Content !== undefined) {
          if (view.Content.Capture != undefined) {
            console.log("enter........")
            var kernel = view.Content.Capture._Kernel;
            name = kernel.slice(0, -4).split(" ");
            this.modelFactory.CreateThumbnail(kernel, name);
          }
        }
      }
    });
    return name;
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

  hideViewSegment(a, b) {
    if (a != b)
      return true;
  }

  addView() {

    if (this.views.length <= 7) {
      var inum: number = this.views.length + 1;
      this.views.push({
        "Content": {},
        "_name": "View " + inum,
        "_Title": "View " + inum,
        "_Source": "(Blank)"
      });
      this.showViewSegment(inum - 1);
    }
    else {
      this.alertCtrls.BasicAlert('Maximum 8 views!', 'No more views could be added.');
    }
  }

  deleteView(index) {
    if (this.views.length > 1) {
      let confirm = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete the view pressed?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => { }
          },
          {
            text: 'Delete',
            handler: () => {
              this.views.splice(index, 1);
              if (this.selectedViewIndex == 0) {
                this.showViewSegment(0);
              }
              else {
                this.showViewSegment(index - 1)
              }
              this.evaluateCaptureViews();
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      this.alertCtrls.BasicAlert('Can not be deleted!', 'Atleast 1 view is required.');
    }
  }

  //Code for ViewOptions start
  addBlankCanvas() {
    var canvasView = {
      "Content": {
        "PIP": {
          "PIP.Objects": "",
          "_name": "d002b8ed5fe24f57aab501f05398262c",
          "_CanvasBackgroundBrush": "#FFFFFFFF",
          "_CanvasBackgroundOpacity": "1"
        }
      },
      "_name": "View " + (this.selectedViewIndex + 1),
      "_Title": "View " + (this.selectedViewIndex + 1),
      "_Source": 'Canvas'
    }
    this.views[this.selectedViewIndex] = canvasView;
  }

  import() {
    this.alertCtrls.BasicAlert('Unavailable!', 'View library not available currently.');
  }

  chooseVideo() {
    this._logger.Debug("Adding file mannualy..");
    try {
      if (this.platform.is('cordova')) {
        FileChooser.open().then(uri => {
          console.log(uri);
          FilePath.resolveNativePath(uri)
            .then(filePath => {
              console.log(filePath);
              var path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
              var newFileName = Date.now() + ".mp4";
              console.log(newFileName);

              File.copyFile(path, fileName, cordova.file.externalRootDirectory + "SportsPIP/Video", newFileName)
                .then(success => {
                  console.log('Successfully copied video');
                  this.CreateVideoView(newFileName);

                  if (Connection.connectedServer != null)
                    this.backGroundTransferProcess.TransferVideo(fileName, Connection.connectedServer.Address, this.views);

                })
                .catch(err => {
                  console.log('Failed copying video:' + JSON.stringify(err))
                  this.chooseVideoErrorMsg('Failed copying video:' + err);
                });

            })
            .catch(err => {
              console.log(err);
              this.chooseVideoErrorMsg('Failed Resolving nativepath:' + err);
            });

        }).catch(err => {
          console.log(err);
          this.chooseVideoErrorMsg('Error opening file chooser:' + err);
        });
      }
    }
    catch (err) { this._logger.Error('Error,adding video mannualy: ', err); }
  }

  chooseVideoErrorMsg(err) {
    this._logger.Error("Error in chooseVideo", err);
    this.alertCtrls.BasicAlert('Failed saving video!', JSON.stringify(err));

  }

  // Code for Camera Recording Starts
  recordVideo() {
    let options: CaptureVideoOptions = {};
    MediaCapture.captureVideo(options)
      .then(
      (data: MediaFile[]) => { this.captureSuccess(data) },
      (err: CaptureError) => { this.captureError(err) }
      );
  }

  captureSuccess(MediaFiles) {
    MediaFiles.forEach(mediaFile => {
      var fileUrl = mediaFile.localURL;

      var path = fileUrl.substr(0, fileUrl.lastIndexOf('/') + 1);
      var fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);

      File.moveFile(path, fileName, cordova.file.externalRootDirectory + "SportsPIP/Video", fileName)
        .then(_ => {
          this.CreateVideoView(fileName);
          console.log('Successfully saved video')
          if (Connection.connectedServer != null)
            this.backGroundTransferProcess.TransferVideo(fileName, Connection.connectedServer.Address, this.views);
        })
        .catch(err => {
          console.log('Failed saving video' + err)
          // let alert = this.alertCtrl.create({
          //   title: 'Failed saving video!',
          //   subTitle: JSON.stringify(err),
          //   buttons: ['OK']
          // });
          // alert.present();
        });
    });
  }

  captureError(err) {
    if (err.code == "3") {
      console.log("Reording: " + err.message + ", Code:" + err.code)
      this._logger.Error("Reording: ", err.message)
      this._logger.Error("Code:", err.code)
    }
    else {
      this._logger.Error('Recording Failed!', err.code + ", " + err.message);
      this.alertCtrls.BasicAlert('Recording Failed!', err.code + ", " + err.message);
    }
  }

  // Code for Camera Recording Starts

  IPCamCapture() {
    this._logger.Debug('creating IPCam Video..');
    try {
      let modalOptions: ModalOptions = { showBackdrop: true, enableBackdropDismiss: false };

      var modal = this.modalCtrl.create(Ipcameras, {
        matrix: this.matrix,
        views: this.views,
        selectedViewIndex: this.selectedViewIndex
      }, modalOptions);
      modal.present();

      modal.onDidDismiss((views) => {
        if (views != null) {
          this.views = views;
          this.saveMatrix();
          // this.connection.transferMatrix(this.matrix._Name,duration);
        }
      });
    }
    catch (err) { this._logger.Error('Error,creating IPCam Video: ', err); }

  }

  CreateVideoView(fileName) {
    var localView = {
      "Content": {
        "Capture": {
          "Marker": {
            "Marker.Objects": "",
            "_name": "c379224ff2704c5ea5ad1f10275a28c1"
          },
          "View.ChronoMarker": "",
          "_name": "ba160173f284474c9412192dcd77cb1c",
          "_Kernel": fileName,
          "_Title": "View " + (this.selectedViewIndex + 1),
          "_Name": "ba160173f284474c9412192dcd77cb1c",
          "_IsActive": "False"
        }
      },
      "_name": "View " + (this.selectedViewIndex + 1),
      "_Title": "View " + (this.selectedViewIndex + 1),
      "_Source": "Local"
    }
    this.views[this.selectedViewIndex] = localView;
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