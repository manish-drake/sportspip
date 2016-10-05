var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AppVersion } from 'ionic-native';
import { NavController, ActionSheetController, AlertController, PopoverController, ViewController } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
import { SettingsPage } from '../settings/settings';
import { CollectionPage } from '../collection/collection';
import { ChannelCollectionPage } from '../channelcollection/channelcollection';
export var HomePage = (function () {
    function HomePage(navCtrl, popoverCtrl, actionSheetCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
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
        this.channels = [
            {
                title: 'Channel 1',
                channelMatrices: [
                    { image: 'assets/sample.jpg', title: 'Matrix 1' },
                    { image: 'assets/sample.jpg', title: 'Matrix 2' },
                    { image: 'assets/sample.jpg', title: 'Matrix 3' },
                ]
            },
            {
                title: 'Channel 2',
                channelMatrices: [
                    { image: 'assets/sample.jpg', title: 'Matrix 1' },
                    { image: 'assets/sample.jpg', title: 'Matrix 2' },
                ]
            },
            {
                title: 'Channel 3',
                channelMatrices: [
                    { image: 'assets/sample.jpg', title: 'Matrix 1' },
                    { image: 'assets/sample.jpg', title: 'Matrix 2' },
                    { image: 'assets/sample.jpg', title: 'Matrix 3' },
                    { image: 'assets/sample.jpg', title: 'Matrix 4' },
                    { image: 'assets/sample.jpg', title: 'Matrix 5' },
                ]
            },
        ];
    }
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
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html',
        }), 
        __metadata('design:paramtypes', [NavController, PopoverController, ActionSheetController, AlertController])
    ], HomePage);
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
    PopoverPage = __decorate([
        Component({
            template: "\n    <ion-list no-lines>\n    <ion-item (click)=\"onAbout()\">\n      <ion-icon item-left name=\"information-circle\"></ion-icon>About\n      </ion-item>\n    </ion-list>\n  "
        }), 
        __metadata('design:paramtypes', [ViewController, AlertController])
    ], PopoverPage);
    return PopoverPage;
}());
