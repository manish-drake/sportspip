import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, ViewController, Platform, AlertController } from 'ionic-angular';
import { File } from 'ionic-native';
import { Login } from '../settings/login/login'
import { Subscription } from '../../Stubs/Subscription';
import { StorageFactory } from '../../Factory/StorageFactory';
import { Package } from '../../pages/Package';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
declare var cordova: any;
/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [Subscription, StorageFactory, Package]
})

export class SettingsPage {

  chanelList = [];
  subscribeList = [];
  public FirstName: any;
  public LastName: any;
  Header = [];


  constructor(public navCtrl: NavController,
    private subscription: Subscription,
    private http: Http,
    private storagefactory: StorageFactory,
    private packages: Package,
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
      this.GetserverHeader();
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


  GetserverHeader() {
    //local
    this.http.get("assets/Header.xml")
      .subscribe(res => {
        console.log("getting header");
        this.SerializeServerData(res);
      })

    //server
    // return this.http.get("http://sportspip.cloudapp.net:10101/IStorageService/getmtxhdrs")
    //   .map(res => {
    //     var headerData = JSON.parse(res.text());
    //     this.Save(headerData, "header.xml");
    //   }).toPromise();
  }


  SerializeServerData(headerData) {
    console.log("serialize header");
    var res = JSON.parse(headerData.text());
    var result = res.Header;
    var item = {
      Title: result.Title, DateCreated: result.DateCreated, Name: result.name, Channel: result.Channel,
      ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
      Views: result.Clips
    };
    this.Header.push(item);
    this.SaveDownloadedHeaders(this.Header);
  }

  //Save Downloaded Header
  SaveDownloadedHeaders(HeaderList) {
    HeaderList.forEach((res) => {
      Observable.interval(2000)
        .take(1).map((x) => x + 5)
        .subscribe((x) => {
          console.log("save header");
          this.storagefactory.SaveRoamingHeader(res, res.Channel, res.Sport, res.Name);
          this.DownloadThumbnailAsync(res.Channel, res.Name);
        })
    })
    // this.storagefactory.SaveRoamingHeader(Data, HeaderList.Channel, HeaderList.Sport, HeaderList.name);
  }

  DownloadThumbnailAsync(channelName,matrixName){
    this.packages.DownloadThumbnailfromServer(channelName,matrixName);
  }

  // Save(blob, filename) {
  //   File.createFile(cordova.file.dataDirectory, filename, true).then(() => {
  //     File.writeFile(cordova.file.dataDirectory, filename, blob, true).then(() => {

  //     })
  //   })
  // }

  //server header
  // SaveServerHeaders() {
  //   this.http.get(cordova.file.dataDirectory+"/matrix.xml").subscribe(data => {
  //     var headerList = JSON.parse(data.text());
  //     headerList.forEach(header => {
  //       var result = header;
  //       var item = {
  //         Title: result.Title, DateCreated: result.DateCreated, Name: result.UploadIndex.toString(), Channel: result.ChannelName,
  //         ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadIndex, Duration: result.Duration,
  //         Views: result.Views
  //       };
  //       this.Header.push(item);
  //     });
  //     this.SaveDownloadedHeaders(this.Header);
  //   })
  // }

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