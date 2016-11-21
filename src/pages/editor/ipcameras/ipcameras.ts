import { Component } from '@angular/core';
import { NavController, ModalController, ViewController } from 'ionic-angular';

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
    private modalCtrl: ModalController) { }

  ionViewDidLoad() {
    console.log('Hello Ipcamera Page');
  }

  isTimerOn: boolean = false;

  presentSettingsModal() {
    let modal = this.modalCtrl.create(IpCamSettingsModal);
    modal.present();
  }

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

  startRecording(){
    
  }
}

@Component({
  selector: 'page-IpCamsSettingsModal',
  template: `
  <ion-header no-shadow >
</ion-header>
<ion-content>
    </ion-content>
  `
})
export class IpCamSettingsModal {

  constructor(public viewCtrl: ViewController) {

  }
}
