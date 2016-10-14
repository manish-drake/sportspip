import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';


import { MatrixInfoPage } from '../matrixinfo/matrixinfo'
/*
  Generated class for the Editor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html'
})
export class EditorPage {

  matrix: any;
  //views: any = [{ Source: 'Blank' }];
  views: any;
  selectedViewIndex: number = 0;
  selectedView: any;
  ifViewOptions: boolean;
  ifViewCanvas: boolean;
  ifViewVideo: boolean;

  //variables for Video Timeline
  sliderValue: any;
  volumeValue: number;
  timelinePosition: any;
  timelineDuration: any;
  repeatColor: any;

  constructor(public navCtrl: NavController, params: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController) {
    this.matrix = params.get("matrixData");
    this.views = this.matrix["Matrix.Children"]["View"];

    this.showSegment(this.selectedViewIndex);


    // for Video Timeline
    this.volumeValue = 50;
    this.playPauseButtonIcon = "play";
    this.repeatColor = "light"
    this.volumeButtonIcon = "volume-up";
    this.timelinePosition = 0;
  }

  ionViewDidLoad() {
    console.log('Hello Editor Page');
  }

  presentInfoModal() {
    let modal = this.modalCtrl.create(MatrixInfoPage, {
      matrixData: this.matrix
    });
    modal.present();
  }

  showSegment(viewindex: number) {
    if (viewindex != this.selectedViewIndex) {
      this.selectedViewIndex = viewindex;
    }
    this.selectedView = this.views[viewindex];
    this.evaluateView();
  }

  hideSegment(a, b) {
    if (a != b)
      return true;
  }

  evaluateView() {
    if (this.selectedView.Source == "(Blank)") {
      this.ifViewOptions = true;
    }
    else {
      this.ifViewOptions = false;
    }
    if (this.selectedView.Source == 'Canvas') {
      this.ifViewCanvas = true;
    }
    else {
      this.ifViewCanvas = false;
      if (this.interval != null) {
        window.clearInterval(this.interval);
      }
    }
    if (this.selectedView.Source == 'Local') {
      this.ifViewVideo = true;
      this.loadVideo();
    }
    else {
      this.ifViewVideo = false;
    }
  }

  addView() {
    if (this.views.length <= 7) {
      this.views.push({
        "name": "View " + (this.views.length+1),
        "Title": "View " + (this.views.length+1),
        "Source": "(Blank)"
      });
      this.showSegment(this.selectedViewIndex+1);
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

  // Define View using view options
  defineView(typeparam) {
    switch (typeparam) {
      case 'Canvas':
        this.views[this.selectedViewIndex] = {
          "name": "View " + this.selectedViewIndex,
          "Title": "View " + this.selectedViewIndex,
          "Source": typeparam
        };
        this.showSegment(this.selectedViewIndex);
        break;
      case 'Local':
        this.views[this.selectedViewIndex] = {
          "name": "View " + this.selectedViewIndex,
          "Title": "View " + this.selectedViewIndex,
          "Source": typeparam
        };
        this.showSegment(this.selectedViewIndex);
        //this.addLocalVideo();
        break;
      case 'Camera':
        this.views[this.selectedViewIndex] = {
          "name": "View " + this.selectedViewIndex,
          "Title": "View " + this.selectedViewIndex,
          "Source": "Local"
        };
        this.showSegment(this.selectedViewIndex);
        this.addLocalVideo();
        break;
    }
  }

  addLocalVideo() {
    let alert = this.alertCtrl.create({
      title: 'Under Progress!',
      subTitle: 'You cannot add local video.',
      buttons: ['OK']
    });
    alert.present();
  }

  cameraCapture() {
    let alert = this.alertCtrl.create({
      title: 'Under Progress!',
      subTitle: 'You cannot record video.',
      buttons: ['OK']
    });
    alert.present();
  }

  importFromLibrary() {
    let alert = this.alertCtrl.create({
      title: 'Unavailable!',
      subTitle: 'View library not available currently.',
      buttons: ['OK']
    });
    alert.present();
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
                this.showSegment(0)
              }
              else {
                this.showSegment(index-1)
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


  //------Start-----Code for Video Timeline

  videoPath:string;

  interval: any = null;

  viewBoxSize:any;

  loadVideo() {
    this.videoPath = "assets/"+this.selectedView["Content"]["Capture"]["_Kernel"];
    window.setTimeout(() => {
      var video = <HTMLVideoElement>document.getElementById("video");
      var volFactor = this.volumeValue / 100;
      video.volume = volFactor;

      this.viewBoxSize = '0 0 '+ video.videoWidth+ ' ' + video.videoHeight;

      video.addEventListener('ended', () => {
        this.playPauseButtonIcon = 'play';
      })

      this.interval = window.setInterval(() => {
        var factor = (100000 / video.duration) * video.currentTime;
        this.sliderValue = factor;
        this.timelinePosition = this.formatTime(video.currentTime);
        this.timelineDuration = this.formatTime(video.duration);
      }, 1);
    }, 1)


  }

  formatTime(time) {
    var min = Math.floor(time / 60);
    var minutes = (min >= 10) ? min : "0" + min;
    var sec = Math.floor(time % 60);
    var seconds = (sec >= 10) ? sec : "0" + sec;
    return minutes + ":" + seconds;
  }
  playPauseButtonIcon: string;
  volumeButtonIcon: string;

  captureController(state) {
    var video = <HTMLVideoElement>document.getElementById("video");
    switch (state) {
      case 'sliderValueChange':
        var factor = video.duration * (this.sliderValue / 100000);
        video.currentTime = factor;
        break;
      case 'playPause':
        if (video.paused == true) {
          video.play();
          this.playPauseButtonIcon = 'pause';
        } else {
          video.pause();
          this.playPauseButtonIcon = 'play';
        }
        break;
      case 'repeatVideo':
        if (video.loop == true) {
          video.loop = false;
          this.repeatColor = 'inactive';
        } else {
          video.loop = true;
          this.repeatColor = 'light';
        }
        break;
      case 'previousVideoFrame':
        if (video.currentTime >= 0) {
          video.pause();
          this.playPauseButtonIcon = 'play';
          video.currentTime = video.currentTime - 0.1;
        }
        break;
      case 'nextVideoFrame':
        if (video.currentTime <= video.duration) {
          video.pause();
          this.playPauseButtonIcon = 'play';
          video.currentTime = video.currentTime + 0.1;
        }
        break;
      case 'playbackRateVideo':
        var speed = video.playbackRate;
        switch (speed) {
          case 0.5:
            speed = speed + 0.5;
            break;
          case 1:
            speed = speed + 0.5;
            break;
          case 1.5:
            speed = speed + 0.5;
            break;
          case 2:
            speed = speed - 1.5;
            break;
          default:
            speed = 1;
            break;
        }

        video.playbackRate = speed;
        break;
      case 'volumeValueChange':
        var volFactor = this.volumeValue / 100;
        video.volume = volFactor;
        if (volFactor == 0) {
          this.volumeButtonIcon = "volume-off";
        } else {
          this.volumeButtonIcon = "volume-up";
        }
        break;
      case 'MuteVideo':
        if (video.muted == false) {
          video.muted = true;
          this.volumeButtonIcon = "volume-off";
        } else {
          video.muted = false;
          this.volumeButtonIcon = "volume-up";
        }
        break;
    }
  }
  //------End-----Code for Video Timeline
}
