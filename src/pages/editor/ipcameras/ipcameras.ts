import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, AlertController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { DirectoryEntry } from 'ionic-native';
import { Observable } from 'rxjs/Rx';
import { IpCamSettingsModal } from '../../../pages/editor/ipcamsettings-modal/ipcamsettings-modal'
import { Connection } from '../../../pages/Connection';
import { Connectivity } from '../../connectivity/connectivity';
import { StorageFactory } from '../../../Factory/StorageFactory';
import { BackGroundTransferProcessIP } from '../../../Action/BackGroundTransferProcessIP';
import { AlertControllers } from '../../../Action/Alerts';
import X2JS from 'x2js';
import { Logger } from '../../../logging/logger';
import { ModelFactory } from '../../../Factory/ModelFactory';

/*
  Generated class for the Ipcamera page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any;

@Component({
  selector: 'page-ipcameras',
  templateUrl: 'ipcameras.html',
  providers: [StorageFactory, ModelFactory, Connection, BackGroundTransferProcessIP]
})
export class Ipcameras {
  matrix: any;
  views: any;
  selectedViewIndex: any;

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private http: Http,
    private backGroundTransferProcessIP: BackGroundTransferProcessIP,
    private alertCtrl: AlertController,
    private alertCtrls: AlertControllers,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private navParams: NavParams,
    private storagefactory: StorageFactory,
    private modelFactory: ModelFactory,
    private _logger: Logger) {

    this.matrix = this.navParams.data.matrix;
    this.views = this.navParams.data.views;
    this.selectedViewIndex = this.navParams.data.selectedViewIndex;
  }

  isConnected: boolean = true;
  isLoading: boolean = true;

  ionViewDidLoad() {
    console.log('Hello Ipcamera Page');
    this._logger.Debug('Ipcamera Page loaded');
  }

  ionViewDidEnter() {
    this._logger.Debug('Ipcamera Page entered');
    this.loadIPCams();
  }

  recordingDuration: number = 5;
  isRecording: boolean = false;
  refreshing: boolean = false;

  doRefresh(refresher) {
    this.refreshing = true;
    this.ipCams.length == 0
    setTimeout(() => {
      refresher.complete();
      this.refreshing = false;
      this.loadIPCams();
    }, 500);
  }

  openConnectivity() {
    this.navCtrl.push(Connectivity);
  }

  ipCams = [];

  loadIPCams() {
    this.ipCams.length = 0;

    if (Connection.connectedServer == null) {
      this.isLoading = false;
      this.isConnected = false;
      let alert = this.alertCtrl.create({
        title: 'Not connected!',
        message: 'Please connect to an available server.',
        buttons: [
          {
            text: 'Connect',
            handler: () => {
              this.openConnectivity();
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              alert.dismiss();
            }
          }
        ]
      });
      alert.present();
    }
    else {
      this.isLoading = false;
      this.isConnected = true;
      this.isLoading = true;
      var connectedServerIP = Connection.connectedServer.Address;

      var requestUri = "http://" + connectedServerIP + ":10080/icamera/cams/ip/";

      setTimeout(() => {
        this.http.get(requestUri)
          .map(res => res.text()).catch((err) => new Observable(err => { this._logger.Error("Error,IPCam loading", err); }))
          .subscribe(
          data => {
            let parser: any = new X2JS();
            var jsonData = parser.xml2js(data);
            if (jsonData.Cams.IPCam != undefined) {
              if (jsonData.Cams.IPCam instanceof Array) {
                this.ipCams = jsonData.Cams.IPCam;
              }
              else {
                this.ipCams.push(jsonData.Cams.IPCam);
              }
            }
          },
          err => {
            console.error('There was an error: ' + err);
            this.isLoading = false;
          },
          () => {
            console.log('Random Quote Complete');
            this.isLoading = false;
          });
      }, 1000);
    }
  }

  getIPCamPreview(cam) {
    var url;
    switch (cam._Make) {
      case "SAMSUNG":
        url = "http://admin:Samsung99@" + cam._IPAdd + "/Streaming/channels/101/picture";
        break;
      case "HIKVISION":
        url = "http://admin:12345@" + cam._IPAdd + "/Streaming/channels/101/picture";
        break;
      default:
        url = "http://admin:12345@" + cam._IPAdd + "/Streaming/channels/101/picture";
        break;
    }
    return url;
  }

  isTimerOn: boolean = false;

  timerDelay: number = 3;

  timerButtonOpacity: Number = 0.5;

  timerONOFF() {
    if (this.isTimerOn == false) {
      this.isTimerOn = true;
      this.timerButtonOpacity = 1;
    }
    else {
      this.isTimerOn = false;
      this.timerButtonOpacity = 0.5;
    }
  }

  presentSettingsModal() {
    let modal = this.modalCtrl.create(IpCamSettingsModal, {
      timerDelay: this.timerDelay
    });
    modal.present();

    modal.onDidDismiss(TimerDelay => {
      this.timerDelay = TimerDelay;
    });
  }

  loader = this.loadingCtrl.create({
    content: '... ',
    duration: (this.timerDelay * 1000) + (this.recordingDuration * 1000) + 180000,
    dismissOnPageChange: true
  });

  startRecording() {
    this.isRecording = true;
    if (this.isTimerOn) {
      var time = Number(this.timerDelay);
      this.loader.present();
      this.loader.setContent('Wait ' + time.toString() + 's');

      var interval = setInterval(() => {
        time--;
        this.loader.setContent('Wait ' + time.toString() + 's');
        if (time <= 0) {
          clearInterval(interval);
          // this.loader.dismiss();
          this.record();
        }
      }, 1000)
    }
    else {
      this.loader.present();
      this.record();
    }
  }

  record() {
    this.loader.setContent('Starting Recording..');

    var connectedServerIP = Connection.connectedServer.Data.Location;
    var fileName = Date.now();
    var uri: string = "http://" + connectedServerIP + ":10080/icamera/cams/ip/" + fileName + "/rec?duration=" + this.recordingDuration;
    console.log('Request URI: ' + uri);
    this.http.post(uri, null)
      .toPromise()
      .then(res => {
        this._logger.Debug("Recording for IP Cams on network");
        console.log('Response: ' + res);
        var time: number = 0;
        var interval = setInterval(() => {
          time++;
          this.loader.setContent('Recording ' + time.toString() + 's');

          if (time >= this.recordingDuration) {
            clearInterval(interval);
            this.TransferMatrix(fileName, connectedServerIP);
            this.createViews(fileName);
          }
        }, 1000);
      })
      .catch(err => {
        this.loader.dismiss();
        this.isRecording = false;
        this._logger.Error("Error,Recording IPCam Videos", err);
        this.alertCtrls.BasicAlert('Error,Recording IPCam Videos', err);
      });
  }

  index = 1;
  TransferMatrix(fileName, connectedServerIP) {
    this.loader.setContent('Transferring Matrix..');
    this.backGroundTransferProcessIP.transferMatrix(fileName, this.recordingDuration, this.ipCams.length, connectedServerIP)
      .then((res) => {
        if (res) {
          this._logger.Debug("transferring IP Cams matrix on network");

          this.GetVideoFileFromServer(fileName, connectedServerIP).then((success) => {
            var value = success;
            this._logger.Info("Video transfered successfully  " + JSON.stringify(cordova.file.externalRootDirectory) + "SportsPIP/Video");
            this.saveMatrix();

          })
        }
      })
      .catch((err) => {
        this.loader.dismiss();
        this._logger.Error("Error,transferring IP Cams matrix to service", err);
        this.alertCtrls.BasicAlert('Error,transferring matrix to service', err);
      })
  }

  GetVideoFileFromServer(name, connectedServerIP): Promise<DirectoryEntry> {
    this.loader.setContent('Getting Videos..');
    name = name + "_" + this.index + ".mp4";
    this._logger.Debug("Getting IP Cams " + name + " from network");
    return this.backGroundTransferProcessIP.GetServerIPVideo(name, connectedServerIP).then((blob) => {
      return this.storagefactory.CreateFile(cordova.file.externalRootDirectory + "SportsPIP/Video", name)
        .then((success) => {
          return this.storagefactory.WriteFile(cordova.file.externalRootDirectory + "SportsPIP/Video", name, blob["response"].slice(8))
            .then((success) => {
              this._logger.Debug(name + " video received successfully from network");
              this.index++;
              if (this.index > this.ipCams.length) { return success["nativeUrl"] }
              else { return this.GetVideoFileFromServer(name.slice(0, -6), connectedServerIP); }
            })
        })

    }).catch((err) => {
      this._logger.Error("Error,Getting IP Cams Video from network.", err);
      this.loader.dismiss();
    })
  }

  saveMatrix() {
    this.loader.setContent('Saving..');

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
            this.loader.dismiss();
            this.navCtrl.popToRoot();
          });
      })
      .catch((err) => {
        this.loader.dismiss();
        this._logger.Error("Error,Matrix file saving..", err);
        this.navCtrl.pop();
      });
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



  createViews(fileName) {
    if (this.ipCams.length == 1) {
      this.createVideoView(fileName + "_1.mp4");
    }
    else {
      this.ipCams.forEach((element, index) => {
        if (index == 0) {
          this.createVideoView(fileName + "_1.mp4");
        }
        else {
          this.selectedViewIndex++;
          this.addView();
          this.createVideoView(fileName + "_" + (index + 1) + ".mp4");
        }
      });
    }
  }

  createVideoView(fileName) {
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
      "_Source": "IP"
    }
    this.views[this.selectedViewIndex] = localView;
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
    }
    else {
      this.alertCtrls.BasicAlert('Maximum 8 views!', 'No more views could be added.');
    }
  }
}
