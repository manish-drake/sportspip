import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaggingComponent } from 'app/main/sportspip/tagging/tagging.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from '../../extensions/media-player/media-player.module';
import { TaggingPipe } from '../tagging.pipe';
import { FormsModule} from '@angular/forms';







const routes: Routes = [
  
  { path: 'tagging',component: TaggingComponent},
];

@NgModule({
  declarations: [TaggingComponent,TaggingPipe],
  imports: [
    CommonModule, RouterModule.forChild(routes),
     NgbModule, CoreCommonModule, 
     ContentHeaderModule,MediaPlayerModule,
     FormsModule
     
  ],
  
 
  
})
export class TaggingModule { }
