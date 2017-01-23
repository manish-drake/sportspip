import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { Subscription } from '../../../Services/Subscription';
import { Logger } from '../../../logging/logger';
import { LoadingController } from 'ionic-angular';
import { Utils } from '../../../Services/common/utils';

@Injectable()
export class Subscribe implements ICommand {
    constructor(private subscription: Subscription, private _logger: Logger, private loadingCtrl: LoadingController, private utils: Utils) {

    }

    run(cmdArgs) {
        this._logger.Debug('Subscribing channel list..');
        if (cmdArgs.model.FirstName == null) {
            cmdArgs.model.presentLoginModal();
        }
        else {
            this.subscription.RequestSubscriptionAsync(cmdArgs.channelName, cmdArgs.model.UserID).then((data) => {
                cmdArgs.model.chanelList = [];
                cmdArgs.model.subscribeList = [];
                cmdArgs.model.createSettingsasync()
                let loader = this.loadingCtrl.create({
                    content: "Subscribing..",
                    duration: 6000
                });
                loader.present();
                this.utils.GetserverHeader(cmdArgs.channelName);
            }).catch((err) => { this._logger.Error('Error,Subscribing channel list..', err); });
        }

    }
}