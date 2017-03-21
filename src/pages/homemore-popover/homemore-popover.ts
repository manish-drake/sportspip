import { Component } from '@angular/core';
import { NavController,ViewController, Platform } from 'ionic-angular';
import { AppVersion, EmailComposer, Device } from 'ionic-native';
import { Observable } from 'rxjs/Rx';
import { Alert } from '../../Services/common/alerts';
import { Storage } from '../../Services/Factory/Storage';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { Logger } from '../../logging/logger';
import { SettingsPage } from '../settings/settings';

@Component({
    selector: 'homemore-popover',
    templateUrl: 'homemore-popover.html'
})
export class HomeMorePopover {

    versionNumber: any;
    sqliteLogDirectory: any;
    rootDirectory: any;

    constructor(public viewCtrl: ViewController,
        public navCtrl: NavController,
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
            AppVersion.getVersionNumber().then((s) => {
                this.versionNumber = s;
            })
        }
    }
    onSettings() {
        this.navCtrl.push(SettingsPage);
    }

    // onAbout() {
    //     this.viewCtrl.dismiss();
    //     this.alertCtrls.BasicAlert('Sports PIP', 'version ' + this.versionNumber);
    // }

    /*$Candidate for refactoring$*/
    //why storage still lurking outside the storage file
    sendLogs() {
        this.viewCtrl.dismiss();

        this.platform.ready().then(() => {
            this.storageFactory.CheckFile(this.sqliteLogDirectory, "data.db")
                .catch(err => new Observable(err => {
                    this._Logger.Error("Error: no log file exists", JSON.stringify(err));
                    this.alertCtrls.BasicAlert("No log file found", JSON.stringify(err));
                }))
                .subscribe(promise => {
                    console.log("Success: " + JSON.stringify(promise));
                    this.storageFactory.CheckFile(this.rootDirectory + "SportsPIP/", "data.db")
                        .catch(err => new Observable(err => { this.getLogsFile(); }))
                        .subscribe(promise => {
                            this.storageFactory.RemoveFile(this.rootDirectory + "SportsPIP/", "data.db")
                                .then(promise => {
                                    this.getLogsFile();
                                })
                        })
                })
        });

    }

    getLogsFile() {
        this.storageFactory.CopyFile(this.sqliteLogDirectory, "data.db", this.rootDirectory + "SportsPIP/", "data.db")
            .catch(err => new Observable(err => {
                this._Logger.Error("Error copying log file: ", JSON.stringify(err));
                this.alertCtrls.BasicAlert("Error getting logs file", JSON.stringify(err));
            }))
            .subscribe(promise => {
                this._Logger.Debug("Composing email");
                this.composeEmail();
            })

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
