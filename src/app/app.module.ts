import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';
import { HomePage, PopoverPage1 } from '../pages/home/home';
import { EditorPage } from '../pages/editor/editor';
import { MatrixInfoPage } from '../pages/matrixinfo/matrixinfo'
import {GroupBy} from '../GroupBy/GroupBy';
import { SettingsPage } from '../pages/settings/settings';
import { CollectionPage } from '../pages/collection/collection'
import { ChannelCollectionPage,PopoverPage2 } from '../pages/channelcollection/channelcollection'

@NgModule({
  declarations: [
    sportspip,
    HomePage,
    PopoverPage1,
    EditorPage,
    MatrixInfoPage,
    SettingsPage,
    CollectionPage,
    ChannelCollectionPage,
    PopoverPage2,
    GroupBy
  ],
  imports: [
    IonicModule.forRoot(sportspip)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    sportspip,
    HomePage,
    PopoverPage1,
    EditorPage,
    MatrixInfoPage,
    SettingsPage,
    CollectionPage,
    ChannelCollectionPage,
    PopoverPage2
  ],
  providers: []
})
export class AppModule { }
