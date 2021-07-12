import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachesfiltercoachesComponent } from './coachesfiltercoaches.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreSidebarModule } from '@core/components';

const routes:Routes = [

  { path:'coachesfilter', component:CoachesfiltercoachesComponent}
]

@NgModule({
  declarations: [CoachesfiltercoachesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreSidebarModule
  ]
})
export class CoachesmoduleModule { }
