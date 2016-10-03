var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';
import { HomePage, PopoverPage } from '../pages/home/home';
import { EditorPage } from '../pages/editor/editor';
import { SettingsPage } from '../pages/settings/settings';
import { CollectionPage } from '../pages/collection/collection';
import { ChannelCollectionPage } from '../pages/channelcollection/channelcollection';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                sportspip,
                HomePage,
                PopoverPage,
                EditorPage,
                SettingsPage,
                CollectionPage,
                ChannelCollectionPage
            ],
            imports: [
                IonicModule.forRoot(sportspip)
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                sportspip,
                HomePage,
                PopoverPage,
                EditorPage,
                SettingsPage,
                CollectionPage,
                ChannelCollectionPage
            ],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
