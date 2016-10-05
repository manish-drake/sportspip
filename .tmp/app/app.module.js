import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';
import { HomePage, PopoverPage } from '../pages/home/home';
import { GroupBy } from '../GroupBy/GroupBy';
import { EditorPage } from '../pages/editor/editor';
import { SettingsPage } from '../pages/settings/settings';
import { CollectionPage } from '../pages/collection/collection';
import { ChannelCollectionPage } from '../pages/channelcollection/channelcollection';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        sportspip,
                        HomePage,
                        PopoverPage,
                        EditorPage,
                        SettingsPage,
                        CollectionPage,
                        ChannelCollectionPage,
                        GroupBy
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
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = [];
    return AppModule;
}());
