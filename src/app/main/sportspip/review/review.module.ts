import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { RouterModule, Routes } from '@angular/router';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';
import { FormsModule } from '@angular/forms';



const routes: Routes = [
  
  { path: 'review/:session', component: ReviewComponent},
  // { path: 'review/session',component: ReviewComponent}

];
@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),MediaPlayerModule,
    FormsModule
  ]
})
export class ReviewModule { }
