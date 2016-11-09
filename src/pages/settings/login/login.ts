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
    this.IsLoginAvailable = "Registration";
  }
   presentLogin() { console.log('Hello Login Page');
    this.LoginAvailable = true;
    this.IsLoginAvailable = "Log in";
  }
  login(){
    var email= document.getElementsByName("email");
    this.ValidateEmail(email);
  }
  signup(){
    var email = document.getElementsByName("signupEmail");
    this.ValidateEmail(email);
  }
ValidateEmail(email){
 
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
  var input = document.createElement('input');
 
  input.type = 'email';
  input.value = email;
 
  return typeof input.checkValidity == 'function' ? input.checkValidity() : re.test(email);
 
}
}
