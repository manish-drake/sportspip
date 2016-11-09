import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController } from 'ionic-angular';
import { AppVersion } from 'ionic-native';
import { Login } from '../settings/login/login'
import { Subscription } from '../../Stubs/Subscription';
/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [Subscription]
})
export class SettingsPage {

  chanelList = [];
  subscribeList = [];

  constructor(public navCtrl: NavController, private subscription: Subscription, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
    this.InvalidateSubscribeListAsync();
    this.InvalidateChannelListAsync();
  }

  InvalidateSubscribeListAsync() {
    this.subscribeList = this.subscription.GetSubscriptionList();
  }

  InvalidateChannelListAsync() {
    var ChanelList = this.subscription.GetChannelsAsync();
    ChanelList.forEach(channel => {
      var value = this.subscribeList.find(x => x.ChannelName == channel.ChannelName)
      if (value == undefined) {
        this.chanelList.push(channel);
      }
    });
  }

  SubscribeList(index, channelName) {
    var channel = this.subscription.RequestSubscriptionAsync(channelName);
    this.subscribeList.push(channel);
    this.chanelList.splice(index, 1);
  }

  UnSubscribeList(index) {
    this.subscribeList.splice(index, 1);
    this.chanelList = [];
    this.InvalidateChannelListAsync();
  }

  ionViewDidLoad() {
    console.log('Hello Settings Page');
  }
  public FirstName: any;
  presentLoginModal() {
    let modal = this.modalCtrl.create(Login);
    modal.onDidDismiss(data => {
      this.FirstName = "Sachin";
    });
    modal.present();
  }
  presentPopover(event) {
    let popover = this.popoverCtrl.create(UserActionsPopover);
    popover.present({ ev: event });
  }
}

@Component({
  template: `
    <ion-list no-lines>
    <ion-item>
      <ion-icon item-left name="person"></ion-icon>Log out
      </ion-item>
    </ion-list>
  `
})

export class UserActionsPopover {

  versionNumber: any;

  constructor(){    }
  }
