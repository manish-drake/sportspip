import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import {MediaPlayerModule} from '../../extensions/media-player/media-player.module';

const routes: Routes = [
  
  { path: 'support',component: SupportComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes), NgbModule, CoreCommonModule, ContentHeaderModule,MediaPlayerModule
  ]
})
export class SupportModule { }
