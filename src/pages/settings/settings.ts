import { Component } from '@angular/core';

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

  constructor(
    private _settings: SettingsService,
    private alertCtrls: Alert,
    private _logger: Logger
    ) {

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.UniqueID = SettingsService.uniqueId;
  }

  AppUniqueIdPrompt() {
    this._logger.Debug('App unique id alert prompt opened');
    this.alertCtrls.PromptAlert("App Unique ID", "", "uniqueId", "eg. Tab 17", SettingsService.uniqueId, "text")
      .then(data => {
        SettingsService.uniqueId = (<any>data).uniqueId;
        this._settings.setUniqueID((<any>data).uniqueId);
        this.UniqueID = SettingsService.uniqueId;
      });
  }

}
