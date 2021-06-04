import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Logger } from '../logging/logger';
import { NativeStorageFactory } from '../Services/Factory/NativeStorageFactory'

@Injectable()
export class SettingsService {

    constructor(private platform: Platform,
        private _logger: Logger,
        private _nativeStorageFactory: NativeStorageFactory) {
         this.getUniqueID();
    }
    public static uniqueId: any;
     getUniqueID() {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._nativeStorageFactory.GetItem("sportspipUniqueID")
                    .then(res => {
                        this._logger.Debug("Got saved Unique id: " + res);
                        if (res != null) { SettingsService.uniqueId = res }
                    })
                    .catch(err => { this._logger.Debug("No saved Unique id: " + JSON.stringify(err)) })
            }
        })
    }
    setUniqueID(uniqueId) {
        this.platform.ready().then(() => {
            if (this.platform.is('cordova')) {
                this._nativeStorageFactory.SetItem("sportspipUniqueID", uniqueId)
                    .then(res => { this._logger.Debug("Saved Unique id successfully: " + res) })
                    .catch(err => { this._logger.Debug("Error saving Unique id: " + JSON.stringify(err)) })
            }
        })
    }
}