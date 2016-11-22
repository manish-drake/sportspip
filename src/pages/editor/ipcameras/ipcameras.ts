import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, AlertController, NavParams, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';
import X2JS from 'x2js';

import { Connection } from '../../../pages/Connection';
import { Connectivity } from '../../connectivity/connectivity';

/*
  Generated class for the Ipcamera page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ipcamera',
  templateUrl: 'ipcameras.html'
})
export class Ipcameras {

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private http: Http,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('Hello Ipcamera Page');
  }

  ionViewDidEnter() {
    this.loadIPCams();
  }


  openConnectivity() {
    this.navCtrl.push(Connectivity);
  }

  ipCams = [];

  loadIPCams() {
    this.ipCams.length = 0;

    if (Connection.connectedServer == null) {
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
      var connectedServerIP = Connection.connectedServer.Address;
      var Port = Connection.connectedServer.Port;

      var requestUri = "http://" + connectedServerIP + ":10080/icamera/cams/ip/";

      this.http.get(requestUri)
        .map(res => res.text())
        .subscribe(
        data => {
          let parser: any = new X2JS();
          var jsonData = parser.xml2js(data);
          this.ipCams = jsonData.Cams.IPCam;
        },
        err => console.error('There was an error: ' + err),
        () => console.log('Random Quote Complete')
        );
    }
  }

  getIPCamPreview(ipAdd: string) {
    return "http://" + ipAdd + "/Streaming/channels/101/picture";
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
    var Name = Date.now();
    var uri: string = "http://" + connectedServerIP + ":10080/icamera/cams/ip/" + Name + "/rec?duration=" + this.recordingDuration;
    console.log('Request URI: ' + uri);
    this.http.post(uri, null)
      .toPromise()
      .then(res => {
        console.log('Response: ' + res);
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
