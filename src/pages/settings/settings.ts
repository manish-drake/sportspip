import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, ViewController, Platform, LoadingController } from 'ionic-angular';
import { Login } from '../settings/login/login'
import { Subscription } from '../../Services/Subscription';
import { StorageFactory } from '../../Services/Factory/StorageFactory';
import { Storage } from '../../Services/Factory/Storage';
import { Package } from '../../Services/Package';
import { Http } from '@angular/http';
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
  providers: [Subscription, Package]
})

export class SettingsPage {

  chanelList = [];
  subscribeList = [];
  public FirstName: any;
  public UserID: any;
  public LastName: any;
  Header = [];

  private storageDataDir: string;

  constructor(public navCtrl: NavController,
    private storage: Storage,
    private subscription: Subscription,
    private http: Http,
    private storagefactory: StorageFactory,
    private packages: Package,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private _logger: Logger) {
    this.storageDataDir = this.storage.externalDataDirectory();
  }

  ionViewDidLoad() {
    this._logger.Debug('Settings Page loaded');
    this.createSettingsasync();
  }

  InvalidateSubscribeListAsync(userId) {
    this._logger.Debug('Invalidating subscribe channel list..');
    this.subscribeList = [];
    this.subscription.GetSubscriptionList(userId).then((data) => {
      this.subscribeList = data;
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

  SubscribeList(index, channelName) {
    this._logger.Debug('Subscribing channel list..');
    if (this.FirstName == null) {
      this.presentLoginModal();
    }
    else {
      this.subscription.RequestSubscriptionAsync(channelName, this.UserID).then((data) => {
        this.chanelList = [];
        this.subscribeList = [];
        this.createSettingsasync()
        let loader = this.loadingCtrl.create({
          content: "Subscribing..",
          duration: 6000
        });
        loader.present();
        this.GetserverHeader(channelName);
      }).catch((err) => { this._logger.Error('Error,Subscribing channel list..', err); });
      // var channel = this.subscription.RequestSubscriptionAsync(channelName, this.UserID);
      // this.subscribeList.push(channel);
      // this.chanelList.splice(index, 1);
      // this.GetserverHeader(channelName);
    }
  }

  UnSubscribeList(index, channelName) {
    this._logger.Debug('unSubscribing channel list..');
    this.subscription.RemoveSubscriptionAsync(channelName, this.UserID).then((data) => {
      this.chanelList = [];
      this.subscribeList = [];
      this.createSettingsasync()
      this.storagefactory.RemoveFileAsync(this.storageDataDir + "Server", channelName).then(() => {
      })
    }).catch((err) => { this._logger.Error('Error,unSubscribing channel list..', err); });
  }

  createSettingsasync() {
    this._logger.Debug('Creating Settings channel list..');
    this.http.get(this.storageDataDir + "Roaming/User.json").map(response => response.json())
      .catch(err => new Observable(observer => { this.UserID = 0; this.InvalidateChannelListAsync("0"); console.log("no user find"); }))
      .subscribe(result => {
        this.SetUserAcync(result)
        this.InvalidateSubscribeListAsync(this.UserID);
        this.InvalidateChannelListAsync(this.UserID);
      });
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
      console.log(data);
      if (data != null) {
        this.SetUserAcync(data);
        this.InvalidateSubscribeListAsync(this.UserID);
        this.InvalidateChannelListAsync(this.UserID);
        let loader = this.loadingCtrl.create({
          content: "Fetching Channel Headers..",
          duration: 10000
        });
        loader.present();
        Observable.interval(2000)
          .take(1).map((x) => x + 5)
          .subscribe((x) => {
            this.subscribeList.forEach(sub => {
              this.GetserverHeader(sub.ChannelName)
            });
          });

      }
    });
    modal.present();
  }

  GetserverHeader(channelname) {
    //stub
    // this.http.get("assets/Header.xml")
    //   .subscribe(res => {
    //     console.log("getting header");
    //     this.SerializeServerData(res);
    //   })

    //server
    console.log("saving headers list file..");
    this.http.get("http://sportspipservice.cloudapp.net:10106/IMobile/getmtxhdrs")
      .subscribe(res => {
        var headerData = JSON.parse(res.text());
        this.Save(headerData, "header.xml");
        Observable.interval(2000)
          .take(1).map((x) => x + 5)
          .subscribe((x) => {
            console.log("saving headers list file..")
            this.SaveServerHeaders(channelname);
          });
      });
  }
  Save(blob, filename) {
    this.storagefactory.CreateFile(this.storageDataDir, filename).then((res) => {
      this.storagefactory.WriteFile(this.storageDataDir, filename, blob).then((res) => {
        this._logger.Debug("Saving user");
      })
    })
  }

  //server header
  SaveServerHeaders(channel) {
    this.http.get(this.storageDataDir + "/header.xml").subscribe(data => {
      var headerList = JSON.parse(data.text());
      headerList.forEach(header => {
        var result = header;
        if (result.ChannelName == channel) {
          var item = {
            Title: result.Title, DateCreated: result.DateCreated, Name: result.UploadIndex, Channel: result.ChannelName,
            ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadIndex, Duration: result.Duration,
            Views: result.Views
          };
          this.Header.push(item);
        }

      });
      this.SaveDownloadedHeaders(this.Header);
    })
  }


  //stub header
  // SerializeServerData(headerData) {
  //   console.log("serialize header");
  //   var res = JSON.parse(headerData.text());
  //   var result = res.Header;
  //   var item = {
  //     Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
  //     ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
  //     Views: result.Clips
  //   };
  //   this.Header.push(item);
  //   this.SaveDownloadedHeaders(this.Header);
  // }

  //Save Downloaded Header
  SaveDownloadedHeaders(HeaderList) {
    HeaderList.forEach((res) => {
      Observable.interval(2000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          this.storagefactory.SaveRoamingHeader(res, res.Channel, res.Sport, res.Name);
          this.DownloadThumbnailAsync(res.Channel, res.Name);
        })
    })
  }

  DownloadThumbnailAsync(channelName, matrixName) {
    this.packages.DownloadThumbnailfromServer(channelName, matrixName);
  }


  //signOut 
  presentPopover(event) {
    let popover = this.popoverCtrl.create(UserActionsPopover);
    popover.present({ ev: event });
    popover.onDidDismiss(data => {
      if (data != null) {
        this.platform.ready().then(() => {
          this.storagefactory.RemoveFileAsync(this.storageDataDir + "Roaming", "User.json").then((res) => {
            this.FirstName = null;
            this.UserID = 0;
            this.subscribeList = [];
            this.InvalidateChannelListAsync(this.UserID);
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
    private http: Http,
    private platform: Platform) {
  }
  signOut() {
    this.viewCtrl.dismiss("signOut");
  }
}
