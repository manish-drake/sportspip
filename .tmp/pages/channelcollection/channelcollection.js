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
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
/*
  Generated class for the Channelcollection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var ChannelCollectionPage = (function () {
    function ChannelCollectionPage(navCtrl, params, actionSheetCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.alertCtrl = alertCtrl;
        this.firstParam = params.get("firstPassed");
        this.channelMatrices = [
            { image: 'assets/sample.jpg', title: 'Matrix 1' },
            { image: 'assets/sample.jpg', title: 'Matrix 2' },
            { image: 'assets/sample.jpg', title: 'Matrix 3' },
            { image: 'assets/sample.jpg', title: 'Matrix 4' },
            { image: 'assets/sample.jpg', title: 'Matrix 5' },
            { image: 'assets/sample.jpg', title: 'Matrix 6' },
        ];
    }
    ChannelCollectionPage.prototype.channelMatrixPressed = function (index, title) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [{
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
                    text: 'Delete',
                    role: 'destructive',
                    handler: function () {
                        console.log('Destructive clicked');
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
    ChannelCollectionPage = __decorate([
        Component({
            selector: 'page-channelcollection',
            templateUrl: 'channelcollection.html'
        }), 
        __metadata('design:paramtypes', [NavController, NavParams, ActionSheetController, AlertController])
    ], ChannelCollectionPage);
    return ChannelCollectionPage;
}());
