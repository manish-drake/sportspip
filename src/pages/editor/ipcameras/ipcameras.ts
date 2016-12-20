import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, AlertController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Connection } from '../../../pages/Connection';
import { Connectivity } from '../../connectivity/connectivity';
import { StorageFactory } from '../../../Factory/StorageFactory';
import { BackGroundTransferProcessIP } from '../../../Action/BackGroundTransferProcessIP';
import X2JS from 'x2js';

/*
  Generated class for the Ipcamera page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any;

@Component({
  selector: 'page-ipcameras',
  templateUrl: 'ipcameras.html',
  providers: [StorageFactory, Connection, BackGroundTransferProcessIP]
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
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private navParams: NavParams,
    private storagefactory: StorageFactory) {

    this.matrix = this.navParams.data.matrix;
    this.views = this.navParams.data.views;
    this.selectedViewIndex = this.navParams.data.selectedViewIndex;

  }

  isConnected: boolean = true;
  isLoading: boolean = true;

  ionViewDidLoad() {
    console.log('Hello Ipcamera Page');
  }

  ionViewDidEnter() {
    this.loadIPCams();
  }

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

  dismiss() {
    this.viewCtrl.dismiss(null);
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
          .map(res => res.text())
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
    })
  }

  recordingDuration: number = 5;

  isRecording: boolean = false;

  startRecording() {
    this.isRecording = true;
    if (this.isTimerOn) {
      var time = Number(this.timerDelay);

      let loader = this.loadingCtrl.create({
        content: 'Wait ' + time.toString() + 's',
        duration: this.timerDelay * 1000,
        dismissOnPageChange: true
      });
      loader.present();

      var interval = setInterval(() => {
        time--;
        loader.setContent('Wait ' + time.toString() + 's');
        if (time <= 0) {
          clearInterval(interval);
          this.record();
        }
      }, 1000)
    }
    else {
      this.record();
    }
  }

  record() {
    console.log("Recording for IP Cams on network");
    var connectedServerIP = Connection.connectedServer.Data.Location;
    var fileName = Date.now();
    var uri: string = "http://" + connectedServerIP + ":10080/icamera/cams/ip/" + fileName + "/rec?duration=" + this.recordingDuration;
    console.log('Request URI: ' + uri);
    this.http.post(uri, null)
      .toPromise()
      .then(res => {
        console.log('Response: ' + res);
        this.createViews(fileName);

        var time = Number(0);
        let loader = this.loadingCtrl.create({
          content: 'Recording ' + time.toString() + 's',
          duration: this.recordingDuration * 1000,
          dismissOnPageChange: true
        });
        loader.present();

        var interval = setInterval(() => {
          time++;
          loader.setContent('Recording ' + time.toString() + 's');
          if (time >= this.recordingDuration) {
            clearInterval(interval);
            this.isRecording = false;
            this.backGroundTransferProcessIP.transferMatrix(fileName, this.recordingDuration, this.ipCams.length);
            this.viewCtrl.dismiss(this.views);

          }
        }, 1000);
      })
      .catch(err => {
        console.log('Error: ' + err);
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err,
          buttons: ['OK']
        });
        alert.present();
        this.isRecording = false;
      });
  }

  createViews(fileName) {
    this.ipCams.forEach((element, index) => {
      if (index > 0) {
        this.selectedViewIndex++;
        this.addView();
      }
      this.createVideoView(fileName + "_" + (index + 1) + ".mp4");
    });
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
      "_Source": "Local"
    }
    this.views[this.selectedViewIndex] = localView;
  }

  addView() {
    if (this.views.length <= 7) {
      var inum: number = this.views.length + 1;
      this.views.push({
        "_name": "View " + inum,
        "_Title": "View " + inum,
        "_Source": "(Blank)"
      });
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
}

@Component({
  selector: 'page-IpCamsSettingsModal',
  template: `
  <ion-header no-shadow>

  <ion-toolbar no-border-bottom>
    <ion-title color="primary">IP Cam Settings</ion-title>
    <ion-buttons end>
      <button ion-button color="primary" (click)="dismiss()">OK</button>
    </ion-buttons>
  </ion-toolbar>

</ion-header>
<ion-content padding style=" ::-webkit-scrollbar,*::-webkit-scrollbar: display: none;">

<ion-item>
<ion-label item-left fixed>Timer ({{timerDelay}}s)</ion-label>
<ion-range item-right min="3" max="15" step="3" snaps="true" [(ngModel)]="timerDelay">
<ion-label range-left>3s</ion-label>
<ion-label range-right>15s</ion-label>
</ion-range>
</ion-item>
<ion-item>
<ion-label item-left fixed>Brightness</ion-label>
<ion-range>
<ion-icon range-left small name="sunny"></ion-icon>
<ion-icon range-right name="sunny"></ion-icon>
</ion-range>
</ion-item>
<ion-item>
<ion-label item-left fixed>AWB</ion-label>
<ion-range>
<ion-icon range-left small name="contrast"></ion-icon>
<ion-icon range-right name="contrast"></ion-icon>
</ion-range>
</ion-item>
<ion-item>
<ion-label item-left fixed>Zoom</ion-label>
<ion-range>
<ion-icon range-left small name="search"></ion-icon>
<ion-icon range-right name="search"></ion-icon>
</ion-range>
</ion-item>

</ion-content>
  `
})
export class IpCamSettingsModal {

  timerDelay: number;

  constructor(public viewCtrl: ViewController,
    private navParams: NavParams) {
    this.timerDelay = navParams.data.timerDelay;
  }

  dismiss() {
    this.viewCtrl.dismiss(this.timerDelay);
  }
}
