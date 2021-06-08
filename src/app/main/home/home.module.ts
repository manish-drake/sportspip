import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from '../extensions/media-player/media-player.module';
import { HomeRootComponent } from './home-root/home-root.component';
import { HomeRootModule } from './home-root/home-root.module'



@NgModule({
  declarations: [],
  imports: [ 
    CommonModule,  NgbModule, CoreCommonModule, ContentHeaderModule,MediaPlayerModule, HomeRootModule]
})
export class HomeModule { }
