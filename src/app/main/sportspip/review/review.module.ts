import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { RouterModule, Routes } from '@angular/router';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';



const routes: Routes = [
  
  { path: 'review',component: ReviewComponent},
];
@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),MediaPlayerModule
  ]
})
export class ReviewModule { }
