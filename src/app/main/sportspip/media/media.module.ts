import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {MediaPlayerModule} from '../../extensions/media-player/media-player.module';
import {MediaComponent} from 'app/main/sportspip/media/media.component';

const routes: Routes = [
  
  { path: 'media',component: MediaComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes), NgbModule, CoreCommonModule, ContentHeaderModule,MediaPlayerModule
  ]
})
export class MediaModule { }
