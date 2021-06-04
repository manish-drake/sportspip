import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'ipcamsettings-modal',
  templateUrl: 'ipcamsettings-modal.html'
})
export class IpCamSettingsModal {

  timerDelay: number;

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    this.timerDelay = navParams.data.timerDelay;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IpcamsettingsModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss(this.timerDelay);
  }

}
