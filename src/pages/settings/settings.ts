import { Component } from '@angular/core';
import { ModalController, PopoverController, LoadingController } from 'ionic-angular';
import { Login } from '../settings/login/login'
import { Subscribe } from '../settings/action/subscribe'
import { Unsubscribe } from '../settings/action/unsubscribe'
import { Signin } from '../settings/action/login'
import { SignOut } from '../settings/action/signOut'
import { Subscription } from '../../Services/Subscription';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { Core } from '../../Services/core';
import { Storage } from '../../Services/Factory/Storage';
import { Utils } from '../../Services/common/utils';
import { Observable } from 'rxjs/Rx';
import { Logger } from '../../logging/logger';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [Subscription, Subscribe, Unsubscribe, Signin, SignOut, Utils]
})

export class SettingsPage {

  chanelList = [];
  subscribeList = [];
  public FirstName: any;
  public UserID: any;
  public LastName: any;
  Header = [];

  private storageDataDir: string;

  constructor(
    private storage: Storage, private subscription: Subscription,
    private core: Core, private unSubscribe: Unsubscribe,
    private signOut: SignOut, private _logger: Logger,
    private subscribe: Subscribe, private signin: Signin,
    private storagefactory: StorageFactory, private utils: Utils,
    private modalCtrl: ModalController, private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this._logger.Debug('Settings Page loaded');
    this.createSettingsasync();
  }

  createSettingsasync() {
    this.storage.externalDataDirectory().then((res) => {
      this.storageDataDir = res;
      this._logger.Debug('Creating Settings channel list..');
      this.core.ReadMatrixFile(this.storageDataDir + "Roaming", "User.json")
        .catch(err => new Observable(err => {
          this.UserID = 0;
          this.InvalidateChannelListAsync("0");
          console.log("no user find");
        }))
        .subscribe((res) => {
          this.SetUserAcync(JSON.parse(res.toString()));
          this.InvalidateSubscribeListAsync(this.UserID).then((res) => {
            if (res) {
              this.InvalidateChannelListAsync(this.UserID);
            }
          });

        })
    });
  }

  InvalidateSubscribeListAsync(userId) {
    this._logger.Debug('Invalidating subscribe channel list..');
    this.subscribeList = [];
    return this.subscription.GetSubscriptionList(userId).then((data) => {
      this.subscribeList = data;
      return true;
    });
  }

  InvalidateChannelListAsync(userId) {
    this._logger.Debug('Invalidating UnSubscribe channel list..');
    this.chanelList = [];
    this.subscription.GetChannelsAsync(userId).then((data) => {
      data.forEach(channel => {
        var value = this.subscribeList.find(x => x.ChannelName == channel.ChannelName)
        if (value == undefined) {
          this.chanelList.push(channel);
        }
      });
    }).catch((err) => { });

  }

  private _subscribeCmd: Subscribe;
  public get subscribeCmd(): Subscribe {
    return this.subscribe;
  }

  SubscribeSource(index, channelName) {
    return {
      "index": index,
      "channelName": channelName,
      "model": this
    }
  }


  private _unSubscribeCmd: Unsubscribe;
  public get unSubscribeCmd(): Unsubscribe {
    return this.unSubscribe;
  }

  UnsubscribeSource(index, channelName) {
    return {
      "index": index,
      "channelName": channelName,
      "model": this
    }
  }

  SetUserAcync(data) {
    this.FirstName = data.FirstName;
    this.LastName = data.LastName;
    this.UserID = data.UserId;
  }

  //register and  login
  presentLoginModal() {
    let modal = this.modalCtrl.create(Login);
    modal.onDidDismiss(data => {
      if (data != null) {
        this.SetUserAcync(data);
        this.InvalidateSubscribeListAsync(this.UserID).then((res) => {
          this.InvalidateChannelListAsync(this.UserID);
          let loader = this.loadingCtrl.create({
            content: "Fetching Channel Headers..",
            duration: 10000
          });
          loader.present();
          this.subscribeList.forEach(sub => {
            console.log(sub.ChannelName);
            this.utils.GetserverHeader(sub.ChannelName);
          });
        });
      }
    });
    modal.present();
  }

  //signOut 
  presentPopover(event) {
    this.signOut.run(event, this);
  }
}
