import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { HttpService } from '../../../Services/httpService';
import { Observable } from 'rxjs/Rx';
import { Connection } from '../../../Services/Connection';
import { Connectivity } from '../../connectivity/connectivity';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { Storage } from '../../../Services/Factory/Storage';
import { BackGroundTransferProcessIP } from '../../../Services/BackGroundTransferProcessIP';
import { Alert } from '../../../Services/common/alerts';
import X2JS from 'x2js';
import { Logger } from '../../../logging/logger';
import { ModelFactory } from '../../../Services/Factory/ModelFactory';
import { SaveMatrix } from '../action/saveMatrix';
import { IPCamRecording } from '../ipcameras/action/ipCamRecording';
import { OpenSettingModal } from '../ipcameras/action/openSettingModal';

@Component({
  selector: 'page-ipcameras',
  templateUrl: 'ipcameras.html',
  providers: [Connection, BackGroundTransferProcessIP, SaveMatrix, IPCamRecording, OpenSettingModal]
})
export class Ipcameras {
  matrix: any;
  views: any;
  selectedViewIndex: any;
  rootDir: String;
  isTimerOn: boolean = false;
  timerDelay: number = 3;
  timerButtonOpacity: Number = 0.5;
  constructor(private saveMatrices: SaveMatrix,
    private openSettingM: OpenSettingModal,
    private ipCamRecording: IPCamRecording,
    private storage: Storage,
    public navCtrl: NavController,
    private httpService: HttpService,
    private backGroundTransferProcessIP: BackGroundTransferProcessIP,
    private alertCtrls: Alert,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private navParams: NavParams,
    private storagefactory: StorageFactory,
    private modelFactory: ModelFactory,
    private _logger: Logger) {

    this.matrix = this.navParams.data.matrix;
    this.views = this.navParams.data.views;
    this.selectedViewIndex = this.navParams.data.selectedViewIndex;
    this.storage.externalRootDirectory().then((res) => {
      this.rootDir = res;
    });
  }

  isConnected: boolean = true;
  isLoading: boolean = true;

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
    if (Connection.connectedServer == null) this.connectionAlert();
    else this.getIPCam();
  }

  connectionAlert() {
    this.isLoading = false;
    this.isConnected = false;
    this.alertCtrls.ConfirmationAlert("Not connected!", "Please connect to an available server.", "Connect").then((res) => {
      if (res.toString() == "Connect") {
        this.openConnectivity();
      }
    });
  }

  getIPCam() {
    this.isLoading = false;
    this.isConnected = true;
    var connectedServerIP = Connection.connectedServer.Address;
    this._logger.Debug("Getting IP Cams @ http://" + connectedServerIP + ":10080/icamera/cams/ip/");
    setTimeout(() => {
      this.httpService.GetCamFromServer("http://" + connectedServerIP + ":10080/icamera/cams/ip/")
        .catch((err) => new Observable(err => { this._logger.Error("Error,IPCam loading", err); }))
        .then(data => {
          this._logger.Debug("Getting IP Cameras data: " + JSON.stringify(data))
          let parser: any = new X2JS();
          var jsonData = parser.xml2js(data);
          if (jsonData.Cams.IPCam != undefined) {
            if (jsonData.Cams.IPCam instanceof Array) { this.ipCams = jsonData.Cams.IPCam; }
            else { this.ipCams.push(jsonData.Cams.IPCam); }
          }
        });
    }, 1000);
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


  private _openSettingModal: OpenSettingModal;
  public get openSettingModal(): OpenSettingModal {
    return this.openSettingM;
  }

  openSettingModalSource() {
    return {
      "timer": this.timerDelay
    }
  }

  private _record: IPCamRecording;
  public get record(): IPCamRecording {
    return this.ipCamRecording;
  }

  recordSource() {
    return {
      "ipCam": this
    }
  }

  loader = this.loadingCtrl.create({
    content: '... ',
    duration: (this.timerDelay * 1000) + (this.recordingDuration * 1000) + 180000,
    dismissOnPageChange: true
  });

  private videoFilePrefix: string;
  index = 1;
  TransferMatrix(fileName, connectedServerIP) {
    this.loader.setContent('Transferring Matrix..');
    this.videoFilePrefix = fileName;
    this.backGroundTransferProcessIP.transferMatrix(fileName, this.recordingDuration, this.ipCams.length, connectedServerIP)
      .then((res) => {
        if (res) {
          this._logger.Debug("transferring IP Cams matrix on network");
          this.GetVideoFileFromServer(fileName, connectedServerIP);
        }
      })
      .catch((err) => {
        this.loader.dismiss();
        this._logger.Error("Error,transferring IP Cams matrix to service", err);
        this.alertCtrls.BasicAlert('Error,transferring matrix to service', err);
      })
  }

  GetVideoFileFromServer(name, connectedServerIP) {
    this.loader.setContent('Getting Videos..');
    name = name + "_" + this.index + ".mp4";
    this._logger.Debug("Getting video" + name + " from network");
    this.backGroundTransferProcessIP.GetServerIPVideo(name, connectedServerIP).subscribe((blob) => {
      this.storagefactory.CreateFile(this.rootDir + "SportsPIP/Video", name)
        .subscribe((success) => {
          this.storagefactory.WriteFile(this.rootDir + "SportsPIP/Video", name, blob.slice(8))
            .subscribe((success) => {
              this._logger.Debug(name + " video received successfully from network");
              this.index++;
              if (this.index > this.ipCams.length) {
                this._logger.Info("Video transfered successfully  " + JSON.stringify(this.rootDir) + "SportsPIP/Video");
                this.saveMatrix();
              }
              else {
                return this.GetVideoFileFromServer(name.slice(0, -6), connectedServerIP);
              }
            })
        })
    })
  }

  saveMatrix() {/*$Candidate for refactoring$*///convert saveMatrices to a command
    this.loader.setContent('Saving..');
    this._logger.Debug("Saving matrix..");

    this.saveMatrices.run(this.matrix._Channel, this.matrix._Name, this.views)
      .then((res) => {
        this.experimentalIPCamVideoCopy(this.videoFilePrefix)
          .subscribe(() => {
            this._logger.Info("navigating to root..");
            this.navCtrl.popToRoot();
            this.loader.dismiss();
          });
      }).catch((err) => {
        this.loader.dismiss();
        this._logger.Error("Error, Matrix file saving..", err);
        this.navCtrl.popToRoot();
      });
  }

  //also remove code from saveMatrix.GetThumbName and from this.saveMatrix
  experimentalIPCamVideoCopy(fileName: string): Observable<any> {
    this._logger.Debug("Experimental viseo copy..")
    var path = this.rootDir + "SportsPIP/Video";
    var allFilesCopied = new Observable<any>();
    this.ipCams.forEach((element, index) => {
      var originalFileName = fileName + "_" + (index + 1) + ".mp4";
      var copyFileName = fileName + "_" + (index + 1) + "_copy.mp4";
      allFilesCopied.concat(this.storagefactory.CopyFile(path, originalFileName, path, copyFileName));
    });
    this._logger.Debug("returning from experimental video file copy..");

    return allFilesCopied;
  }

  createViews(fileName) {/*$Candidate for refactoring$*///needs a lot of refactoring. Please make this function static and you'll know all what you have to change. It could be a simple function creating views for a file, taking as argument all what it needs to create views. Instead, it is performing multiple tasks mixing uneven intents
    this.ipCams.forEach((element, index) => {
      if (index > 0) { this.selectedViewIndex++; }
      this.createVideoView(fileName + "_" + (index + 1) + "_copy.mp4");
    })
  }

  createVideoView(fileName) {
    var localView = this.modelFactory.CreateVideoView(fileName, this.selectedViewIndex, "IP")
    this.views[this.selectedViewIndex] = localView;
  }

}
