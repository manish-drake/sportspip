import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';
import { HomePage, MoreActionsPopover } from '../pages/home/home';
import { EditorPage } from '../pages/editor/editor';
import {OrderBy} from '../GroupBy/OrderBy';
import {GroupBy} from '../GroupBy/GroupBy';
import { SettingsPage,UserActionsPopover } from '../pages/settings/settings';
import { Login } from '../pages/settings/login/login';
import { CollectionPage } from '../pages/collection/collection'
import { ChannelCollectionPage,PopoverPage2 } from '../pages/channelcollection/channelcollection'
import { MatrixInfoPage } from '../pages/editor/matrixinfo/matrixinfo';
import { VideoComponent } from '../pages/editor/video-component/video-component'
import { CanvasComponent } from '../pages/editor/canvas-component/canvas-component'
import { Compareview } from '../pages/editor/compareview/compareview'
import { CompareviewComponent,CaptureViewsPopover } from '../pages/editor/Compareview-Component/Compareview-Component'
import { Swipeview } from '../pages/editor/swipeview/swipeview'

@NgModule({
  declarations: [
    sportspip,
    HomePage,
    MoreActionsPopover,
    SettingsPage,
    UserActionsPopover,
    Login,
    CollectionPage,
    ChannelCollectionPage,
    PopoverPage2,
    GroupBy,
    OrderBy,

    EditorPage,
    MatrixInfoPage,
    VideoComponent,
    CanvasComponent,
    Compareview,
    CompareviewComponent,
    CaptureViewsPopover,
    Swipeview
  ],
  imports: [
    IonicModule.forRoot(sportspip)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    sportspip,
    HomePage,
    MoreActionsPopover,
    EditorPage,
    MatrixInfoPage,
    SettingsPage,
    UserActionsPopover,
    Login,
    CollectionPage,
    ChannelCollectionPage,
    PopoverPage2,
    Compareview,
    CompareviewComponent,
    CaptureViewsPopover,
    Swipeview
  ],
  providers: []
})
export class AppModule { }
