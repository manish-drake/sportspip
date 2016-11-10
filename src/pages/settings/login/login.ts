import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Subscription } from '../../../Stubs/Subscription';
import { StorageFactory } from '../../../Factory/StorageFactory';
import { user } from '../user';

/*
  Generated class for the Matrixinfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [Subscription, StorageFactory,user]
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
    this.IsLoginAvailable = "Registration";
  }
  presentLogin() {
    console.log('Hello Login Page');
    this.LoginAvailable = true;
    this.IsLoginAvailable = "Log in";
  }

  Register(email, firstname, lastname) {
    console.log("Registration..");
    this.validateSignUp();
    var user = this.subscription.RegisterAsync(firstname, lastname, email);
    this.storageFactory.SaveUserAsync(user);
    this.dismiss(user);
  }

  Login(email, pwd) {
    this.validateLogin();
    var user = this.subscription.LoginAsync(email, pwd);
    this.storageFactory.SaveUserAsync(user);
    this.dismiss(user);
  }
 validateLogin() {
        if (this.presentLogin) {
            alert("presentLogin");
            var email = <HTMLInputElement>document.getElementById('email');
            var password = <HTMLInputElement>document.getElementById('password');
            if (email.value == null || email.value == "") { }
            else {}
            if (password.value == null || password.value == "" || password.value.length < 6) {}
            else {}
        }
    }
    validateSignUp() {
        alert("presentRegister");
        var email1 = <HTMLInputElement>document.getElementById('email1');
        var fname = <HTMLInputElement>document.getElementById('fname');
        var lname = <HTMLInputElement>document.getElementById('lname');


        if (email1.value == null || email1.value == "") {}
        else { }
        if (fname.value == null || fname.value == "") {}
        else {}
        if (lname.value == null || lname.value == "") {}
        else {}
    }
}

