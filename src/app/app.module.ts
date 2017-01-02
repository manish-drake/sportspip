import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';

import { HomePage } from '../pages/home/home';
import { HomeMorePopover } from '../pages/homemore-popover/homemore-popover';
import { Connectivity } from '../pages/connectivity/connectivity';
import { SettingsPage, UserActionsPopover } from '../pages/settings/settings';
import { Login } from '../pages/settings/login/login';
import { AlertControllers } from '../Services/Alerts';
import { CollectionPage } from '../pages/collection/collection'
import { ChannelCollectionPage, PopoverPage2 } from '../pages/channelcollection/channelcollection'
import { OrderBy } from '../Services/Pipe/OrderBy';
import { GroupBy } from '../Services/Pipe/GroupBy';
import { Storage } from '../Services/Factory/Storage';
import { EditorPage, EditorActionsPopover } from '../pages/editor/editor';
import { MatrixInfoPage } from '../pages/editor/matrixinfo/matrixinfo';
import { Ipcameras } from '../pages/editor/ipcameras/ipcameras'
import { IpCamSettingsModal } from '../pages/editor/ipcamsettings-modal/ipcamsettings-modal'
import { VideoComponent } from '../pages/editor/video-component/video-component'
import { CanvasComponent } from '../pages/editor/canvas-component/canvas-component'
import { Compareview } from '../pages/editor/compareview/compareview'
import { CompareviewComponent, CaptureViewsPopover } from '../pages/editor/Compareview-Component/Compareview-Component'
import { Swipeview } from '../pages/editor/swipeview/swipeview'
import { StorageFactory } from '../Services/Factory/StorageFactory';
import { Logger } from '../logging/logger';
import { AProvider } from '../logging/aProvider';
import { SqliteLogProvider } from '../logging/providers/sqliteLogProvider';

@NgModule({
  declarations: [
    sportspip,
    HomePage,
    HomeMorePopover,
    Connectivity,
    SettingsPage,

    UserActionsPopover,
    Login,
    CollectionPage,
    ChannelCollectionPage,
    PopoverPage2,
    GroupBy,
    OrderBy,

    EditorPage, EditorActionsPopover,
    MatrixInfoPage,
    Ipcameras, IpCamSettingsModal,
    VideoComponent,
    CanvasComponent,
    Compareview,
    CompareviewComponent,
    CaptureViewsPopover,
    Swipeview
  ],
  providers: [
    AlertControllers,
    { provide: AProvider, useClass: SqliteLogProvider },
    Logger, StorageFactory,Storage
  ],
  imports: [
    IonicModule.forRoot(sportspip)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    sportspip,
    HomePage,
    HomeMorePopover,
    Connectivity,

    EditorPage, EditorActionsPopover,
    MatrixInfoPage,
    Ipcameras, IpCamSettingsModal,
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
})
export class AppModule { }
