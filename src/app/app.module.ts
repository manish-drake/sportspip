import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { sportspip } from './app.component';

import { HomePage, MoreActionsPopover } from '../pages/home/home';
import { Connectivity } from '../pages/connectivity/connectivity';
import { SettingsPage, UserActionsPopover } from '../pages/settings/settings';
import { Login } from '../pages/settings/login/login';

import { CollectionPage } from '../pages/collection/collection'
import { ChannelCollectionPage, PopoverPage2 } from '../pages/channelcollection/channelcollection'
import { OrderBy } from '../GroupBy/OrderBy';
import { GroupBy } from '../GroupBy/GroupBy';

import { EditorPage, EditorActionsPopover } from '../pages/editor/editor';
import { MatrixInfoPage } from '../pages/editor/matrixinfo/matrixinfo';
import { Ipcameras, IpCamSettingsModal } from '../pages/editor/ipcameras/ipcameras'
import { VideoComponent } from '../pages/editor/video-component/video-component'
import { CanvasComponent } from '../pages/editor/canvas-component/canvas-component'
import { Compareview } from '../pages/editor/compareview/compareview'
import { CompareviewComponent, CaptureViewsPopover } from '../pages/editor/Compareview-Component/Compareview-Component'
import { Swipeview } from '../pages/editor/swipeview/swipeview'

import { Logger } from '../logging/logger';
import { AProvider } from '../logging/aProvider';
import { ConsoleLogProvider } from '../logging/providers/consoleLogProvider';
import { SqliteLogProvider } from '../logging/providers/sqliteLogProvider';
import { WebSqlLogProvider } from '../logging/providers/websqlLogProvider';

@NgModule({
  declarations: [
    sportspip,
    HomePage,
    Connectivity,
    SettingsPage,
    MoreActionsPopover,

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
  imports: [
    IonicModule.forRoot(sportspip)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    sportspip,
    HomePage,
    Connectivity,

    MoreActionsPopover,
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
  providers: [
    { provide: AProvider, useClass: SqliteLogProvider },
    Logger,
  ]
})
export class AppModule { }
