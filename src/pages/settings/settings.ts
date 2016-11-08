import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, ViewController, Platform, AlertController } from 'ionic-angular';
import { AppVersion } from 'ionic-native';
import { Login } from '../settings/login/login'
import { Subscription } from '../../Stubs/Subscription';
import { Http } from '@angular/http';
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


  constructor(public navCtrl: NavController, 
  private subscription: Subscription, 
  private modalCtrl: ModalController, 
  private popoverCtrl:PopoverController,
  private http:Http,
  private platform:Platform) 
  {

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
  public LastName: any;
  presentLoginModal() {
    let modal = this.modalCtrl.create(Login);
    modal.onDidDismiss(data => {
      this.FirstName = data.FirstName;
      this.LastName = data.LastName; 
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

  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, private platform: Platform, ) {
    if (this.platform.is('cordova')) {
      AppVersion.getVersionNumber().then((s) => {
        this.versionNumber = s;
      })
    }
  }
}