import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';
import { HomePage, PopoverPage } from '../pages/home/home';
import { EditorPage } from '../pages/editor/editor';
import { MatrixInfoPage } from '../pages/matrixinfo/matrixinfo'
import {StorageFactory} from '../Factory/StorageFactory';
import {GroupBy} from '../GroupBy/GroupBy';
import { SettingsPage } from '../pages/settings/settings';
import { CollectionPage } from '../pages/collection/collection'
import { ChannelCollectionPage } from '../pages/channelcollection/channelcollection'

@NgModule({
  declarations: [
    sportspip,
    HomePage,
    PopoverPage,
    EditorPage,
    MatrixInfoPage,
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
    MatrixInfoPage,
    SettingsPage,
    CollectionPage,
    ChannelCollectionPage
  ],
  providers: []
})
export class AppModule { }
