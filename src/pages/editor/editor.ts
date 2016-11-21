import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';

import { File, FileChooser, MediaCapture, CaptureVideoOptions, MediaFile, CaptureError } from 'ionic-native';

import { Http } from '@angular/http';

import { StorageFactory } from '../../Factory/StorageFactory';

import { MatrixInfoPage } from '../editor/matrixinfo/matrixinfo'
import { Compareview } from '../editor/compareview/compareview'
import { Swipeview } from '../editor/swipeview/swipeview'
import { Ipcameras } from '../editor/ipcameras/ipcameras'

declare var cordova: any;

@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
  providers: [StorageFactory],
})

export class EditorPage {

  selectedViewIndex: number = 0;

  matrix: any;
  views = [];

  constructor(public navCtrl: NavController, private params: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private http: Http,
    private storagefactory: StorageFactory, ) {
    this.matrix = params.get("matrixData");
    console.log(this.matrix);
  }

  ionViewDidLoad() {

  }

  ngOnInit() {
    if (this.matrix["Matrix.Children"]["View"] instanceof Array) {
      this.views = this.matrix["Matrix.Children"]["View"]
    }
    else {
      this.views.push(this.matrix["Matrix.Children"]["View"]);
    }
    this.showViewSegment(this.selectedViewIndex);
  }

  ionViewWillUnload() {
    this.saveMatrix();
  }

  saveMatrix() {
    this.platform.ready().then(() => {
      console.log(this.matrix.Channel);
      this.http.get(cordova.file.dataDirectory + "Local/" + this.matrix.Channel + "/Tennis/Matrices/" + this.matrix._Name + "/" + this.matrix._Name + ".mtx")
        .subscribe(data => {
          var res = JSON.parse(data.text());
          var matrix = res.Matrix;
          matrix['Matrix.Children'].View = this.views;
          this.storagefactory.SaveMatrixAsync(res, matrix.Channel, matrix._Sport, matrix._Name, "Matrices");

          var header = this.storagefactory.ComposeMatrixHeader(matrix);
          this.storagefactory.SaveLocalHeader(header, header.Channel, header.Sport, header.Name, "Matrices");
        });
    });
  }

  presentInfoModal() {
    let modal = this.modalCtrl.create(MatrixInfoPage, {
      matrixData: this.matrix
    });
    modal.present();
  }

  showViewSegment(viewindex: number) {
    if (viewindex != this.selectedViewIndex) {
      this.selectedViewIndex = viewindex;
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
        "_name": "View " + inum,
        "_Title": "View " + inum,
        "_Source": "(Blank)"
      });
      this.showViewSegment(inum - 1);
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Maximum 8 views!',
        subTitle: 'No more views could be added.',
        buttons: ['OK']
      });
      alert.present();
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
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Can not be deleted!',
        subTitle: 'Atleast 1 view is required.',
        buttons: ['OK']
      });
      alert.present();
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
      "_name": "View " + this.selectedViewIndex,
      "_Title": "View " + this.selectedViewIndex,
      "_Source": 'Canvas'
    }
    this.views[this.selectedViewIndex] = canvasView;
  }

  import() {
    let alert = this.alertCtrl.create({
      title: 'Unavailable!',
      subTitle: 'View library not available currently.',
      buttons: ['OK']
    });
    alert.present();
  }

  chooseVideo() {
    FileChooser.open().then(uri => {
      console.log(uri);

      (<any>window).FilePath.resolveNativePath(uri, (fileUrl) => {
        console.log(fileUrl);

        var path = fileUrl.substr(0, fileUrl.lastIndexOf('/') + 1);
        var fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);

        File.copyFile(path, fileName, cordova.file.applicationStorageDirectory, fileName).then(_ => {
          console.log('Successfully copied video')
          this.CreateVideoView(fileName);
        }).catch(err => {
          console.log('Failed copying video:' + err)
          this.chooseVideoErrorMsg(err);
        });

      }, (err) => {
        console.log(err);
        this.chooseVideoErrorMsg('Failed Resolving nativepath:' + err);
      });

    }).catch(err => {
      console.log(err);
      this.chooseVideoErrorMsg('Error opening file chooser:' + err);
    });
  }

  chooseVideoErrorMsg(err) {
    let alert = this.alertCtrl.create({
      title: 'Failed saving video!',
      subTitle: err,
      buttons: ['OK']
    });
    alert.present();
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
      console.log(fileUrl);

      var path = fileUrl.substr(0, fileUrl.lastIndexOf('/') + 1);
      var fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);

      File.moveFile(path, fileName, cordova.file.applicationStorageDirectory, fileName)
        .then(_ => {
          console.log('Successfully saved video')
          this.CreateVideoView(fileName);
        })
        .catch(err => {
          console.log('Failed saving video' + err)
          let alert = this.alertCtrl.create({
            title: 'Failed saving video!',
            subTitle: err,
            buttons: ['OK']
          });
          alert.present();
        });
    });
  }

  captureError(err) {
    let alert = this.alertCtrl.create({
      title: 'Recording Failed!',
      subTitle: err,
      buttons: ['OK']
    });
    alert.present();
  }
  // Code for Camera Recording Starts

  IPCamCapture(){
    this.navCtrl.push(Ipcameras);
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
          "_Title": "View " + this.selectedViewIndex,
          "_Name": "ba160173f284474c9412192dcd77cb1c",
          "_IsActive": "False"
        }
      },
      "_name": "View " + this.selectedViewIndex,
      "_Title": "View " + this.selectedViewIndex,
      "_Source": "Local"
    }
    this.views[this.selectedViewIndex] = localView;
  }
  //Code for ViewOptions end

  openCompareView() {
    var captureViews = [];
    this.views.forEach(view => {
      if (view._Source == 'Local') {
        captureViews.push(view);
      }
    });
    console.log(captureViews);
    this.navCtrl.push(Compareview, {
      captureViews: captureViews
    });
  }

  openSwipeView() {
    var captureViews = [];
    this.views.forEach(view => {
      if (view._Source == 'Local') {
        captureViews.push(view);
      }
    });
    console.log(captureViews);
    this.navCtrl.push(Swipeview, {
      captureViews: captureViews
    });
  }
}
