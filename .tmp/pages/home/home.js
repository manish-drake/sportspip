import { Component } from '@angular/core';
import { Factory } from '../../Factory/Factory';
import { AppVersion, File } from 'ionic-native';
import { Http } from '@angular/http';
import { NavController, ActionSheetController, AlertController, PopoverController, ViewController, Platform } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
import { SettingsPage } from '../settings/settings';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
export var HomePage = (function () {
    function HomePage(http, platform, navCtrl, factory, popoverCtrl, actionSheetCtrl, alertCtrl) {
        this.http = http;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.factory = factory;
        this.popoverCtrl = popoverCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.channels = [];
        this.Header = [];
        this.items = [];
        this.selectedSegment = "local";
        this.localMatrices = [
            { image: 'assets/sample.jpg', title: 'Matrix 2' },
            { image: 'assets/sample.jpg', title: 'Matrix 3' },
            { image: 'assets/sample.jpg', title: 'Matrix 4' },
            { image: 'assets/sample.jpg', title: 'Matrix 5' },
            { image: 'assets/sample.jpg', title: 'Matrix 6' },
            { image: 'assets/sample.jpg', title: 'Matrix 7' },
            { image: 'assets/sample.jpg', title: 'Matrix 8' },
            { image: 'assets/sample.jpg', title: 'Matrix 9' },
            { image: 'assets/sample.jpg', title: 'Matrix 10' },
            { image: 'assets/sample.jpg', title: 'Matrix 1' },
        ];
        // this.channels = [
        //   {
        //     title: 'Channel 1',
        //     channelMatrices: [
        //       { image: 'assets/sample.jpg', title: 'Matrix 1' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 2' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 3' },
        //     ]
        //   },
        //   {
        //     title: 'Channel 2',
        //     channelMatrices: [
        //       { image: 'assets/sample.jpg', title: 'Matrix 1' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 2' },
        //     ]
        //   },
        //   {
        //     title: 'Channel 3',
        //     channelMatrices: [
        //       { image: 'assets/sample.jpg', title: 'Matrix 1' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 2' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 3' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 4' },
        //       { image: 'assets/sample.jpg', title: 'Matrix 5' },
        //     ]
        //   },
        // ];
        this.GetserverHeader();
        this.DisplayHeader();
    }
    HomePage.prototype.GetserverHeader = function () {
        var _this = this;
        this.http.get("assets/Header.xml")
            .subscribe(function (data) {
            _this.SerializeServerData(data);
        });
    };
    HomePage.prototype.SerializeServerData = function (headerData) {
        var res = JSON.parse(headerData.text());
        var result = res.Header;
        var item = {
            Title: result.Title, DateCreated: result.DateCreated, Name: "636046147357832112", Channel: result.Channel,
            ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
            Views: result.Clips
        };
        this.Header.push(item);
        this.SaveDownloadedHeaders(this.Header, headerData.text());
    };
    //Save Downloaded Header
    HomePage.prototype.SaveDownloadedHeaders = function (HeaderList, Data) {
        var _this = this;
        HeaderList.forEach(function (res) {
            _this.factory.SaveRoamingHeader(Data, res.Channel, res.Sport, res.Name);
        });
    };
    //Display Server Header
    HomePage.prototype.DisplayHeader = function () {
        var _this = this;
        this.platform.ready().then(function () {
            File.listDir(cordova.file.dataDirectory, "Server/Mayfair/Tennis/Matrices/").then(function (success) {
                success.forEach(function (res) {
                    _this.http.get(cordova.file.dataDirectory + "Server/Mayfair/Tennis/Matrices/" + res.name + "/Header.xml")
                        .subscribe(function (data) {
                        var jsonText = JSON.parse(data.text());
                        var result = jsonText.Header;
                        var item = {
                            Title: result.Title, DateCreated: result.DateCreated, Name: res.name, Channel: result.Channel,
                            ThumbnailSource: result.ThumbnailSource, Sport: result.Sport, Skill: result.Skill, UploadID: result.UploadID, Duration: result.Duration,
                            Views: result.Clips
                        };
                        _this.channels.push(item);
                    });
                });
            });
        });
    };
    //Deleted Server Header
    HomePage.prototype.DeleteServerHeader = function (DirName, index) {
        this.factory.DeleteServerHeader(DirName);
        this.items.splice(index, 1);
    };
    HomePage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    };
    HomePage.prototype.openSettings = function () {
        this.navCtrl.push(SettingsPage);
    };
    HomePage.prototype.newMatrix = function () {
        this.navCtrl.push(EditorPage, {
            firstPassed: 'New Matrix 1'
        });
    };
    HomePage.prototype.openMatrix = function (title) {
        this.navCtrl.push(EditorPage, {
            firstPassed: title
        });
    };
    HomePage.prototype.openCollection = function () {
        this.navCtrl.push(CollectionPage);
    };
    HomePage.prototype.openChannelCollection = function (title) {
        this.navCtrl.push(ChannelCollectionPage, {
            firstPassed: title
        });
    };
    HomePage.prototype.downloadMatrix = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Confirm!',
            buttons: [, {
                    text: 'Download',
                    handler: function () {
                        var alert = _this.alertCtrl.create({
                            title: 'Not Downloaded!',
                            subTitle: 'Download is not possible right now.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () { }
                }
            ]
        });
        actionSheet.present();
    };
    HomePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-home',
                    templateUrl: 'home.html',
                    providers: [Factory],
                },] },
    ];
    /** @nocollapse */
    HomePage.ctorParameters = [
        { type: Http, },
        { type: Platform, },
        { type: NavController, },
        { type: Factory, },
        { type: PopoverController, },
        { type: ActionSheetController, },
        { type: AlertController, },
    ];
    return HomePage;
}());
export var PopoverPage = (function () {
    function PopoverPage(viewCtrl, alertCtrl) {
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
    }
    PopoverPage.prototype.onAbout = function () {
        var _this = this;
        this.viewCtrl.dismiss();
        AppVersion.getVersionNumber().then(function (s) {
            _this.versionNumber = s;
        });
        var alert = this.alertCtrl.create({
            title: 'Sports PIP',
            subTitle: 'version:' + this.versionNumber,
            buttons: ['OK']
        });
        alert.present();
    };
    PopoverPage.decorators = [
        { type: Component, args: [{
                    template: "\n    <ion-list no-lines>\n    <ion-item (click)=\"onAbout()\">\n      <ion-icon item-left name=\"information-circle\"></ion-icon>About\n      </ion-item>\n    </ion-list>\n  "
                },] },
    ];
    /** @nocollapse */
    PopoverPage.ctorParameters = [
        { type: ViewController, },
        { type: AlertController, },
    ];
    return PopoverPage;
}());
