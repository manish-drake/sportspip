import { Injectable, Component } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { PopoverController, ViewController, Platform } from 'ionic-angular';

@Injectable()
export class SignOut {
    constructor(private popoverCtrl: PopoverController, private platform: Platform,
    private storagefactory: StorageFactory) {

    }

    run(event,model) {
        let popover = this.popoverCtrl.create(UserActionsPopover);
        popover.present({ ev: event });
        popover.onDidDismiss(data => {
            if (data != null) {
                this.platform.ready().then(() => {
                    this.storagefactory.RemoveFile(model.storageDataDir + "Roaming", "User.json").then((res) => {
                        model.FirstName = null;
                        model.UserID = 0;
                        model.subscribeList = [];
                        model.InvalidateChannelListAsync(model.UserID);
                    })
                })
            }
        })
    }
}

@Component({
    template: `
    <ion-list no-lines  style="margin:0;">
    <ion-item (click)="signOut()">
      <ion-icon item-left name="log-out"></ion-icon>Log out
      </ion-item>
    </ion-list>
  `
})

export class UserActionsPopover {
    constructor(public viewCtrl: ViewController,
        private platform: Platform) {
    }
    signOut() {
        this.viewCtrl.dismiss("signOut");
    }
}
