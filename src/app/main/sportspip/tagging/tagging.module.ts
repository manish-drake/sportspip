import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaggingComponent } from 'app/main/sportspip/tagging/tagging.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from '../../extensions/media-player/media-player.module';



const routes: Routes = [
  
  { path: 'tagging',component: TaggingComponent},
];

@NgModule({
  declarations: [TaggingComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
     NgbModule, CoreCommonModule, 
     ContentHeaderModule,MediaPlayerModule
  ],
  
})
export class TaggingModule { }
