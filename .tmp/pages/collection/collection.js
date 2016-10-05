import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
/*
  Generated class for the Collection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var CollectionPage = (function () {
    function CollectionPage(navCtrl) {
        this.navCtrl = navCtrl;
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
    CollectionPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-collection',
                    templateUrl: 'collection.html'
                },] },
    ];
    /** @nocollapse */
    CollectionPage.ctorParameters = [
        { type: NavController, },
    ];
    return CollectionPage;
}());
