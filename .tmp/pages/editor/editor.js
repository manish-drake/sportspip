import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
/*
  Generated class for the Editor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var EditorPage = (function () {
    function EditorPage(navCtrl, params, alertCtrl) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.firstParam = params.get("firstPassed");
        this.views = [{ type: 'blank' }];
    }
    EditorPage.prototype.ionViewDidLoad = function () {
        console.log('Hello Editor Page');
        this.showSegment(0);
    };
    EditorPage.prototype.showSegment = function (viewindex) {
        if (viewindex != this.selectedViewIndex) {
            this.selectedViewIndex = viewindex;
        }
        this.selectedView = this.views[viewindex];
        this.evaluateView();
    };
    EditorPage.prototype.hideSegment = function (a, b) {
        if (a != b)
            return true;
    };
    EditorPage.prototype.evaluateView = function () {
        if (this.selectedView.type == 'blank') {
            this.ifViewOptions = true;
        }
        else {
            this.ifViewOptions = false;
        }
        if (this.selectedView.type == 'canvas') {
            this.ifViewCanvas = true;
        }
        else {
            this.ifViewCanvas = false;
        }
        if (this.selectedView.type == 'video') {
            this.ifViewVideo = true;
        }
        else {
            this.ifViewVideo = false;
        }
    };
    EditorPage.prototype.addView = function (typeparam) {
        if (this.views.length <= 7) {
            switch (typeparam) {
                case 'blank':
                    this.views.push({ type: typeparam });
                    this.showSegment(this.selectedViewIndex + 1);
                    break;
                case 'canvas':
                    this.views.push({ type: typeparam });
                    this.showSegment(this.selectedViewIndex + 1);
                    break;
                case 'video':
                    this.views.push({ type: typeparam });
                    this.showSegment(this.selectedViewIndex + 1);
                    this.addLocalVideo();
                    break;
                case 'camera':
                    this.views.push({ type: 'video' });
                    this.showSegment(this.selectedViewIndex + 1);
                    this.cameraCapture();
                    break;
                case 'library':
                    this.importFromLibrary();
                    break;
            }
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: 'Maximum 8 views!',
                subTitle: 'No more views could be added.',
                buttons: ['OK']
            });
            alert_1.present();
        }
    };
    // Define View using view options
    EditorPage.prototype.defineView = function (typeparam) {
        switch (typeparam) {
            case 'canvas':
                this.views[this.selectedViewIndex] = { type: typeparam };
                this.showSegment(this.selectedViewIndex);
                break;
            case 'video':
                this.views[this.selectedViewIndex] = { type: typeparam };
                this.showSegment(this.selectedViewIndex);
                this.addLocalVideo();
                break;
            case 'camera':
                this.views[this.selectedViewIndex] = { type: 'video' };
                this.showSegment(this.selectedViewIndex);
                this.addLocalVideo();
                break;
        }
    };
    EditorPage.prototype.addLocalVideo = function () {
        var alert = this.alertCtrl.create({
            title: 'Under Progress!',
            subTitle: 'You cannot add local video.',
            buttons: ['OK']
        });
        alert.present();
    };
    EditorPage.prototype.cameraCapture = function () {
        var alert = this.alertCtrl.create({
            title: 'Under Progress!',
            subTitle: 'You cannot record video.',
            buttons: ['OK']
        });
        alert.present();
    };
    EditorPage.prototype.importFromLibrary = function () {
        var alert = this.alertCtrl.create({
            title: 'Unavailable!',
            subTitle: 'View library not available currently.',
            buttons: ['OK']
        });
        alert.present();
    };
    EditorPage.prototype.deleteView = function (index) {
        var _this = this;
        if (this.views.length > 1) {
            var confirm_1 = this.alertCtrl.create({
                title: 'Are you sure?',
                message: 'Do you want to delete the view pressed?',
                buttons: [
                    {
                        text: 'Cancel',
                        handler: function () { }
                    },
                    {
                        text: 'Delete',
                        handler: function () {
                            _this.views.splice(index, 1);
                            if (_this.selectedViewIndex == 0) {
                                _this.showSegment(index);
                            }
                            else {
                                _this.showSegment(index - 1);
                            }
                        }
                    }
                ]
            });
            confirm_1.present();
        }
        else {
            var alert_2 = this.alertCtrl.create({
                title: 'Can not be deleted!',
                subTitle: 'Atleast 1 view is required.',
                buttons: ['OK']
            });
            alert_2.present();
        }
    };
    EditorPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-editor',
                    templateUrl: 'editor.html'
                },] },
    ];
    /** @nocollapse */
    EditorPage.ctorParameters = [
        { type: NavController, },
        { type: NavParams, },
        { type: AlertController, },
    ];
    return EditorPage;
}());
