import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, ViewController, Platform, AlertController } from 'ionic-angular';
import { File } from 'ionic-native';
import { Login } from '../settings/login/login'
import { Subscription } from '../../Stubs/Subscription';
import { Http } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
declare var cordova: any;
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
  public FirstName: any;
  public LastName: any;


  constructor(public navCtrl: NavController,
    private subscription: Subscription,
    private http: Http,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private platform: Platform) {

  }
  
  InvalidateSubscribeListAsync() {
    this.subscribeList = [];
    this.subscribeList = this.subscription.GetSubscriptionList();
  }

  InvalidateChannelListAsync() {
    this.chanelList = [];
    var ChanelList = this.subscription.GetChannelsAsync();
    ChanelList.forEach(channel => {
      var value = this.subscribeList.find(x => x.ChannelName == channel.ChannelName)
      if (value == undefined) {
        this.chanelList.push(channel);
      }
    });
  }

  SubscribeList(index, channelName) {
    if (this.FirstName == null) {
      this.presentLoginModal();
    } 
    else {
      var channel = this.subscription.RequestSubscriptionAsync(channelName);
      this.subscribeList.push(channel);
      this.chanelList.splice(index, 1);
    }


  }

  UnSubscribeList(index) {
    this.subscribeList.splice(index, 1);
    this.chanelList = [];
    this.InvalidateChannelListAsync();
  }

  ionViewDidLoad() {
    console.log('Hello Settings Page');
    this.createSettingsasync()
  }

  createSettingsasync() {
    this.http.get(cordova.file.dataDirectory + "Server/User.json").map(response => response.json())
      .catch(err => new Observable(observer => { this.InvalidateChannelListAsync() }))
      .subscribe(result => {
        this.SetUserAcync(result)
        this.InvalidateSubscribeListAsync();
        this.InvalidateChannelListAsync();
      });
  }

  SetUserAcync(data) {
    this.FirstName = data.FirstName;
    this.LastName = data.LastName;
  }

  //register and  login
  presentLoginModal() {
    let modal = this.modalCtrl.create(Login);
    modal.onDidDismiss(data => {
      console.log(data);
      if (data != null) {
        this.SetUserAcync(data);
        this.InvalidateSubscribeListAsync();
        this.InvalidateChannelListAsync();
      }

    });
    modal.present();
  }

  //signOut 
  presentPopover(event) {
    let popover = this.popoverCtrl.create(UserActionsPopover);
    popover.present({ ev: event });
    popover.onDidDismiss(data => {
      console.log(data);
      if (data != null) {
        this.platform.ready().then(() => {
          File.removeFile(cordova.file.dataDirectory + "Server", "User.json").then((res) => {
          })
          this.FirstName = null;
          this.subscribeList = [];
          this.InvalidateChannelListAsync();
        })
      }
    })
  }
}

@Component({
  template: `
    <ion-list no-lines>
    <ion-item (click)="signOut()">
      <ion-icon item-left name="person"></ion-icon>Log out
      </ion-item>
    </ion-list>
  `
})

export class UserActionsPopover {
  constructor(public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private http: Http,
    private platform: Platform) {
  }
  signOut() {
    this.viewCtrl.dismiss("signOut");
  }
}
