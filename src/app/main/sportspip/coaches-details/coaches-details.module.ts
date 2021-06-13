import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachesDetailsComponent } from './coaches-details.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { componentFactoryName } from '@angular/compiler';


const routes : Routes =[
  {path: 'coaches-details', component: CoachesDetailsComponent}
]
@NgModule({
  declarations: [CoachesDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class CoachesDetailsModule { }
