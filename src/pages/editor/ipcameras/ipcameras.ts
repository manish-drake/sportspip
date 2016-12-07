import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, AlertController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Connection } from '../../../pages/Connection';
import { Connectivity } from '../../connectivity/connectivity';
import { StorageFactory } from '../../../Factory/StorageFactory';
import { Transfer } from '../../../Action/Transfer';
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
  providers: [StorageFactory, Connection, Transfer]
})
export class Ipcameras {
  matrix: any;
  views: any;
  selectedViewIndex: any;

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private http: Http,
    private transfer: Transfer,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private navParams: NavParams,
    private storagefactory: StorageFactory) {

    this.matrix = this.navParams.data.matrix;
    this.views = this.navParams.data.views;
    this.selectedViewIndex = this.navParams.data.selectedViewIndex;
  }

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

      var requestUri = "http://" + connectedServerIP + ":10080/icamera/cams/ip/";

      this.http.get(requestUri)
        .map(res => res.text())
        .subscribe(
        data => {
          let parser: any = new X2JS();
          var jsonData = parser.xml2js(data);
          if (jsonData.Cams.IPCam instanceof Array)
            this.ipCams = jsonData.Cams.IPCam;
          else {
            this.ipCams.push(jsonData.Cams.IPCam);
          }

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
            this.transfer.transferMatrix(fileName, this.recordingDuration, "IP", this.ipCams.length);
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

  // //............................matrix transfer code.........................................

  // transferMatrix(fileName, duration, source) {
  //   var serverAddress = Connection.connectedServer.Address;
  //   this.platform.ready().then(() => {

  //     this.createClips(fileName, duration, source);
  //     let parser: any = new X2JS();
  //     var xmlMatrix = parser.js2xml(this.data);

  //     let headers = new Headers({ 'Content-Type': 'application/xml' });
  //     let options = new RequestOptions({ headers: headers });

  //     this.http.post("http://" + serverAddress + ":10080/imatrix/matrices/", xmlMatrix, options)
  //       .subscribe(response => {
  //         console.log("matrix successfully sent");
  //       })
  //   });
  // }

  // data: any;

  // createClips(fileName, duration, source) {
  //   this.data = this.createNewIPMatrix(fileName, duration, source);

  //   this.ipCams.forEach((element, index) => {
  //     var name = fileName + "_" + (index + 1) + ".mp4"
  //     var view = "View" + " " + (index + 1);
  //     this.CreateClip(name, view, this.data);
  //   });
  // }

  // createNewIPMatrix(fileName, duration, source) {
  //   var name = Date.now().toString();
  //   let data =
  //     {
  //       "Matrix": {
  //         "_Name": fileName,
  //         "_Title": "Title1",
  //         "_Sport": "Tennis",
  //         "_Skill": "Serve",
  //         "_PIN": " ",
  //         "_DateModified": name,
  //         "_Duration": duration,
  //         "_Location": "Field",
  //         "_HasTransferred": false,
  //         "_Source": source,
  //         "Clips": {
  //           "Clip": []
  //         }
  //       }
  //     };
  //   return data;

  // }


  // CreateClip(kernel, view, data) {
  //   var clip = {
  //     "_Name": kernel,
  //     "_name": "",
  //     "_Key": view,
  //     "_Duration": "0"
  //   }
  //   data.Matrix.Clips.Clip.push(clip);
  // }

  // //..............................matrix transfered.......................................

  createViews(fileName) {
    this.ipCams.forEach((element, index) => {
      if (index > 0) {
        this.selectedViewIndex++;
        this.addView();
      }
      this.createVideoView(fileName + "_" + (index + 1) + ".mp4");
    });
  }

  //  createViews(fileName) {
  //   if (this.ipCams.length == 1) {
  //     this.createVideoView(fileName + "_1.mp4");
  //   }
  //   else {
  //     this.ipCams.forEach((element, index) => {
  //       if (index == 0) {
  //         this.createVideoView(fileName + "_1.mp4");
  //       }
  //       else {
  //         this.selectedViewIndex++;
  //         this.addView();
  //         this.createVideoView(fileName + "_" + (index + 1) + ".mp4");
  //       }
  //     });
  //   }
  // }

  dismiss() {
    this.viewCtrl.dismiss(null);
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
