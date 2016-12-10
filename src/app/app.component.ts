import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';

declare var cordova: any;

@Component({
    templateUrl: 'app.html'
})
export class sportspip {
    rootPage = HomePage;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            Splashscreen.hide();
            StatusBar.styleDefault();
            this.checkPermissions();
        });
    }

    checkPermissions() {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, (status) => {
            if (!status.hasPermission) {
                permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, (status2) => {
                    if (!status2.hasPermission) {
                        console.log('permission is not turned on');
                        permissionNotGranted("");
                    }
                }, ((err) => {
                    console.log('permission is not turned on: ' + err);
                    permissionNotGranted(err);
                }));
            }
        }, ((err) => {
            console.log('permission is not turned on: ' + err);
            permissionNotGranted(err);
        }));

        var permissionNotGranted = function(err) {
            let alert = this.alertCtrl.create({
                title: 'READ_EXTERNAL_STORAGE not granted',
                subTitle: err,
                buttons: ['OK']
            });
            alert.present();
        }
    }

}
