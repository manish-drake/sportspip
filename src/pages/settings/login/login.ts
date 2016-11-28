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
    providers: [Subscription, StorageFactory, user]
})

export class Login {
    LoginAvailable: boolean = true;
    IsLoginAvailable: string;
    errorMessege: string;
    Email: any;
    LoginEmail: any;
    Password: any;
    FirstName: any;
    LastName: any;

    constructor(private viewCtrl: ViewController, private subscription: Subscription, private storageFactory: StorageFactory) {
        this.IsLoginAvailable = "Login";
        this.errorMessege = " ";
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
        this.IsLoginAvailable = "Sign Up";
        this.errorMessege = " ";
    }
    presentLogin() {
        console.log('Hello Login Page');
        this.LoginAvailable = true;
        this.IsLoginAvailable = "Log in";
        this.errorMessege = " ";
    }

    Register(email, firstname, lastname) {
        console.log("Registration..");
        if (this.validateSignUp()) {
            this.subscription.RegisterAsync(firstname, lastname, email).then((user) => {
                this.storageFactory.SaveUserAsync(user);
                this.dismiss(user);
            }).catch((err) => {
                console.log("Registration error: " + err);
                this.errorMessege = "Registration failed";
            });
        }
    }

    Login(email, pwd) {
        if (this.validateLogin()) {
            this.subscription.LoginAsync(email, pwd).then((user) => {
                this.storageFactory.SaveUserAsync(user);
                this.dismiss(user);
            }).catch((err) => {
                console.log('Login error: ' + err);
                this.errorMessege = "Either Email or Password is incorrect";
            });
        }
    }

    validateLogin() {
        if (!this.LoginEmail || !this.Password) {
            if (!this.LoginEmail) this.errorMessege = "Email ID Requried";
            else if (!this.Password) this.errorMessege = "Password Requried";
            return false;
        }
        else {
            this.errorMessege = "";
            return true;
        }
    }

    validateSignUp() {
        if (!this.Email || !this.FirstName || !this.LastName) {
            if (!this.Email) this.errorMessege = "Email ID Requried";
            else if (!this.FirstName) this.errorMessege = "First Name Requried";
            else if (!this.LastName) this.errorMessege = "Last Name Requried";
            return false;
        }
        else {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!this.Email.match(mailformat)) {
                this.errorMessege = "Invalid Email Id";
                return false;
            }
            else {
                this.errorMessege = "";
                return true;
            }
        }
    }

}

