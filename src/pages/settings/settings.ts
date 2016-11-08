import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Login } from '../settings/LoginModal/Login'
/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,private modalCtrl: ModalController) {}

  ionViewDidLoad() {
    console.log('Hello Settings Page');
  }
presentLoginModal() {
    let modal = this.modalCtrl.create(Login);
    modal.present();
  }
}
