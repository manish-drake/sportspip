import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Subscription } from '../../../Stubs/Subscription';
import { StorageFactory } from '../../../Factory/StorageFactory';

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Subscription, StorageFactory]
})

export class Login {
  LoginAvailable: boolean = true;
  IsLoginAvailable: string;

  constructor(private viewCtrl: ViewController, private subscription: Subscription, private storageFactory: StorageFactory) {
    this.IsLoginAvailable = "Login";
  }
  dismiss(user) {
    this.viewCtrl.dismiss(user);
  }
  ionViewDidLoad() {
    console.log('Hello Login Page');
  }
  presentRegister() {
    console.log('Hello Register Page');
    this.LoginAvailable = false;
    this.IsLoginAvailable = "Register";
  }
  presentLogin() {
    console.log('Hello Login Page');
    this.LoginAvailable = true;
    this.IsLoginAvailable = "Login";
  }

  Register(email, firstname, lastname) {
    console.log("Registration..");
    var user = this.subscription.RegisterAsync(firstname, lastname, email);
    // this.storageFactory.SaveUserAsync(user);
    console.log(user);
    this.dismiss(user);
  }

}
