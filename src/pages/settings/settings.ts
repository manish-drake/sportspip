import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { Logger } from '../../logging/logger';
import { SettingsService } from '../../Services/SettingsService';
import { Alert } from '../../Services/common/alerts';


/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  
  UniqueID: any = "not set";
  errorMessege: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storageFactory: StorageFactory,
    private _setttings: SettingsService,
    private alertCtrls: Alert,
    private platform: Platform,
    private _logger: Logger
    ) {

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.UniqueID = SettingsService.uniqueId;
  }

  AppUniqueIdPrompt() {
    this._logger.Debug('App unique id alert prompt opened');
    this.alertCtrls.PromptAlert("App Unique ID", "", "uniqueId", "eg. Tab 17", SettingsService.uniqueId, "")
      .then(data => {
        SettingsService.uniqueId = (<any>data).uniqueId;
        this._setttings.setUniqueID((<any>data).uniqueId);
        this.UniqueID = SettingsService.uniqueId;
      });
  }

  // saveUniqueID(uniqueID) {
  //   if (this.validateSetting()) {
  //     SettingsService.uniqueId = uniqueID;
  //     this._setttings.setUniqueID(uniqueID);
  //   }
  // }

  // validateSetting() {
  //   if (!this.UniqueID) {
  //     this.errorMessege = "App. Unique ID Requried";
  //     return false;
  //   }
  //   else {
  //     this.errorMessege = "";
  //     return true;
  //   }
  // }



}
