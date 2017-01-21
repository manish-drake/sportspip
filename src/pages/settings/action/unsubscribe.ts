import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { Subscription } from '../../../Services/Subscription';
import { Logger } from '../../../logging/logger';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';

@Injectable()
export class Unsubscribe implements ICommand {
    constructor(private subscription: Subscription, private _logger: Logger,private storageFactory:StorageFactory) {

    }

    run(cmdArgs) {
        this._logger.Debug('unSubscribing channel list..');
        this.subscription.RemoveSubscriptionAsync(cmdArgs.channelName, cmdArgs.model.UserID).then((data) => {
            cmdArgs.model.chanelList = [];
            cmdArgs.model.subscribeList = [];
            cmdArgs.model.createSettingsasync()
            this.storageFactory.RemoveFileAsync(cmdArgs.model.storageDataDir + "Server", cmdArgs.channelName).subscribe(() => {
            })
        }).catch((err) => { this._logger.Error('Error,unSubscribing channel list..', err); });
    }
}