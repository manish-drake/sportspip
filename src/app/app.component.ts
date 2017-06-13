import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class sportspip {
    rootPage = HomePage;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private toastCtrl: ToastController) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            if (this.platform.is('android')) {
                //back button handle
                //Registration of push in Android
                var lastTimeBackPress = 0;
                var timePeriodToExit = 2000;

                this.platform.registerBackButtonAction(() => {
                    //Double check to exit app
                    if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                        this.platform.exitApp(); //Exit from app
                    } else {
                        let toast = this.toastCtrl.create({
                            message: 'Press again to exit..',
                            duration: 3000,
                            position: 'bottom'
                        });
                        toast.present();
                        lastTimeBackPress = new Date().getTime();
                    }
                });
            }
        });
    }

}
