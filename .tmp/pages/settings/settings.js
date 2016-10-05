import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var SettingsPage = (function () {
    function SettingsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    SettingsPage.prototype.ionViewDidLoad = function () {
        console.log('Hello Settings Page');
    };
    SettingsPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-settings',
                    templateUrl: 'settings.html'
                },] },
    ];
    /** @nocollapse */
    SettingsPage.ctorParameters = [
        { type: NavController, },
    ];
    return SettingsPage;
}());
