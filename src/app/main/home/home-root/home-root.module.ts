import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRootComponent } from './home-root.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';


const routes: Routes = [
  
  { path: 'home-root',component: HomeRootComponent},
]; 

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes), NgbModule, CoreCommonModule, ContentHeaderModule,MediaPlayerModule
  ]
})
export class HomeRootModule { }
