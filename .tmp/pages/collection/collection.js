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
import { NavController, ActionSheetController } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var CollectionPage = (function () {
    function CollectionPage(navCtrl, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.localMatrices = [
            { image: 'assets/sample.jpg', title: 'Matrix 1' },
            { image: 'assets/sample.jpg', title: 'Matrix 2' },
            { image: 'assets/sample.jpg', title: 'Matrix 3' },
            { image: 'assets/sample.jpg', title: 'Matrix 4' },
            { image: 'assets/sample.jpg', title: 'Matrix 5' },
            { image: 'assets/sample.jpg', title: 'Matrix 6' },
            { image: 'assets/sample.jpg', title: 'Matrix 7' },
            { image: 'assets/sample.jpg', title: 'Matrix 8' },
            { image: 'assets/sample.jpg', title: 'Matrix 9' },
            { image: 'assets/sample.jpg', title: 'Matrix 10' },
        ];
    }
    CollectionPage.prototype.ionViewDidLoad = function () {
        console.log('Hello Collection Page');
    };
    CollectionPage.prototype.openMatrix = function (title) {
        this.navCtrl.push(EditorPage, {
            firstPassed: title
        });
    };
    CollectionPage.prototype.matrixPressed = function (index, title) {
        var actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: function () {
                        console.log('Destructive clicked');
                    }
                }, {
                    text: 'Save Copy',
                    handler: function () {
                        console.log('Copy clicked');
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    CollectionPage = __decorate([
        Component({
            selector: 'page-collection',
            templateUrl: 'collection.html'
        }), 
        __metadata('design:paramtypes', [NavController, ActionSheetController])
    ], CollectionPage);
    return CollectionPage;
}());
