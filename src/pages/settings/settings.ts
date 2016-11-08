import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private subscription: Subscription) {
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
    this.chanelList=[];
    this.InvalidateChannelListAsync();
  }

  ionViewDidLoad() {
    console.log('Hello Settings Page');
  }

}
