import { Component } from '@angular/core';
import { NavController, ViewController, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { EmailComposer, EmailComposerOptions } from '@ionic-native/email-composer';

import { Alert } from '../../Services/common/alerts';
import { Storage } from '../../Services/Factory/Storage';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { Logger } from '../../logging/logger';

@Component({
    selector: 'homemore-popover',
    templateUrl: 'homemore-popover.html'
})
export class HomeMorePopover {

    versionNumber: any;
    sqliteLogDirectory: any;
    rootDirectory: any;

    constructor(
        public viewCtrl: ViewController,
        public navCtrl: NavController,
        private appVersion: AppVersion,
        private emailComposer: EmailComposer,
        private device: Device,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private alertCtrls: Alert,
        private platform: Platform,
        private _Logger: Logger) {
        if (this.platform.is('cordova')) {/*$Candidate for refactoring$*///must go inside storage
            if (this.platform.is('android')) {
                this.storage.applicationStorageDirectory().then((res) => {
                    this.sqliteLogDirectory = res + 'databases/';
                })
            }
            else if (this.platform.is('ios')) {
                this.storage.externalRootDirectory().then((res) => {
                    this.sqliteLogDirectory = res;
                })
            }
            this.storage.externalRootDirectory().then((res) => {
                this.rootDirectory = res;
            });
            this.appVersion.getVersionNumber().then((s) => {
                this.versionNumber = s;
            })
        }
    }
    onSettings() {
        this.viewCtrl.dismiss("openSettings");
    }

    /*$Candidate for refactoring$*/
    //why storage still lurking outside the storage file
    sendLogs() {
        this.viewCtrl.dismiss();
        console.log("sendLogs() called")
        console.log("Logs directory: " + this.sqliteLogDirectory)
        this.platform.ready().then(() => {
            this.storageFactory.CheckFile(this.sqliteLogDirectory, "data.db")
                .subscribe(promise => {
                    console.log("Success: " + JSON.stringify(promise));
                    this.storageFactory.CheckFile(this.rootDirectory + "SportsPIP/", "data.db")
                        .subscribe(promise => {
                            console.log("Temporary logs file found: " + JSON.stringify(promise))
                            this.storageFactory.RemoveFile(this.rootDirectory + "SportsPIP/", "data.db")
                                .then(promise => {
                                    this.getLogsFile();
                                })
                        }, (err) => {
                            console.log("Temporary Logs file not found: " + JSON.stringify(err))
                            this.getLogsFile();
                        });
                }, (err) => {
                    this._Logger.Error("Error: no log file exists", JSON.stringify(err));
                    this.alertCtrls.BasicAlert("No log file found", JSON.stringify(err));
                })
        });

    }

    getLogsFile() {
        console.log("getLogsFile() called")
        this.storageFactory.CopyFile(this.sqliteLogDirectory, "data.db", this.rootDirectory + "SportsPIP/", "data.db")
        .subscribe((res) => {
            this._Logger.Debug("Composing email");
                this.composeEmail();
        }, (err) => {
            this._Logger.Error("Error copying log file: ", JSON.stringify(err));
                this.alertCtrls.BasicAlert("Error getting logs file", JSON.stringify(err));
        })
    }

    composeEmail() {
        this.emailComposer.isAvailable().then((available) => {
                console.log("Email composer available: " + JSON.stringify(available))
        })

        let attachmentPath: string = this.rootDirectory + "SportsPIP/data.db";
        console.log("Attachment Path: " + attachmentPath)

        // let email: EmailComposerOptions = {
        //     to: 'manish@drake.in',
        //     attachments: [attachmentPath],
        //     subject: "Logs for Sports PIP (" + this.versionNumber + ") from " + this.device.platform + " (See attachment)",
        //     body:
        //         "App Version: " + "<b>" + this.versionNumber + "</b><br>" +
        //         "OS: " + "<b>" + this.device.platform + " " + this.device.version + "</b><br>" +
        //         "Device: " + "<b>" + this.device.manufacturer.toUpperCase() + " " + this.device.model + "</b><br>" +
        //         "<br><br>" +
        //         "Here is the logs file for Sports PIP app as attachment.."
        //     ,
        //     isHtml: true
        // };
        // this.emailComposer.open(email)
        //     .then((res) => {
        //         console.log("Success composing mail: " + JSON.stringify(res))
        //     })
        //     .catch((err) => {
        //         console.log("Error composing mail: " + JSON.stringify(err))
        //     })

    }
}
