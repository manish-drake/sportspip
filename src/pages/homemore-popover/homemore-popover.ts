import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import { AppVersion, File, EmailComposer, Device } from 'ionic-native';

import { AlertControllers } from '../../Services/Alerts';
import { Storage } from '../../Services/Factory/Storage';
import { Logger } from '../../logging/logger';

@Component({
    selector: 'homemore-popover',
    templateUrl: 'homemore-popover.html'
})
export class HomeMorePopover {

    versionNumber: any;
    storageDirectory: any;
    rootDirectory: any;

    constructor(public viewCtrl: ViewController,
        private storage: Storage,
        private alertCtrls: AlertControllers,
        private platform: Platform,
        private _Logger: Logger) {
        if (this.platform.is('cordova')) {/*$Candidate for refactoring$*///must go inside storage
            this.storageDirectory = this.storage.applicationStorageDirectory();
            this.rootDirectory = this.storage.externalRootDirectory();
            AppVersion.getVersionNumber().then((s) => {
                this.versionNumber = s;
            })
        }
    }

    onAbout() {
        this.viewCtrl.dismiss();
        this.alertCtrls.BasicAlert('Sports PIP', 'version ' + this.versionNumber);
    }

/*$Candidate for refactoring$*/
//why storage still lurking outside the storage file
    sendLogs() {
        this.viewCtrl.dismiss();

        this.platform.ready().then(() => {
            File.checkFile(this.storageDirectory + 'databases/', "data.db")
                .then(promise => {
                    console.log("Success: " + JSON.stringify(promise));
                    File.copyFile(this.storageDirectory + 'databases/', "data.db", this.rootDirectory + "SportsPIP/", "data.db")
                        .then(promise => {
                            this._Logger.Debug("Composing email");
                            this.composeEmail();
                        })
                        .catch(err => {
                            this._Logger.Error("Error copying log file: ", JSON.stringify(err));
                            this.alertCtrls.BasicAlert("No log file found", err);
                        });
                })
                .catch(err => {
                    this._Logger.Error("Error: no log file exists", JSON.stringify(err));
                    this.alertCtrls.BasicAlert("No log file found", err);
                });

        });

    }

    composeEmail() {
        let email = {
            to: 'manish@drake.in',
            attachments: [this.rootDirectory + "SportsPIP/data.db"],
            subject: "Logs for Sports PIP (" + this.versionNumber + ") from " + Device.platform + " (See attachment)",
            body:
            "App Version: " + "<b>" + this.versionNumber + "</b><br>" +
            "OS: " + "<b>" + Device.platform + " " + Device.version + "</b><br>" +
            "Device: " + "<b>" + Device.manufacturer.toUpperCase() + " " + Device.model + "</b><br>" +

            "<br><br>" +
            "Here is the logs file for Sports PIP app as attachment.."
            ,
            isHtml: true
        };
        EmailComposer.open(email);
    }
}
