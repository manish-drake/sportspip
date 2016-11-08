import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  LoginAvailable: boolean = true;
  IsLoginAvailable :string;

  constructor(private viewCtrl: ViewController) { 
    this.IsLoginAvailable = "Login";
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('Hello Login Page');
  }
  presentRegister() { console.log('Hello Register Page');
    this.LoginAvailable = false;
    this.IsLoginAvailable = "Register";
  }
   presentLogin() { console.log('Hello Login Page');
    this.LoginAvailable = true;
    this.IsLoginAvailable = "Login";
  }

}
