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
    ChannelCollectionPage.prototype.downloadMatrix = function () {
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
    ChannelCollectionPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-channelcollection',
                    templateUrl: 'channelcollection.html'
                },] },
    ];
    /** @nocollapse */
    ChannelCollectionPage.ctorParameters = [
        { type: NavController, },
        { type: NavParams, },
        { type: ActionSheetController, },
        { type: AlertController, },
    ];
    return ChannelCollectionPage;
}());
