import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachesfiltercoachesComponent } from './coachesfiltercoaches.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreSidebarModule } from '@core/components';
import { FormsModule } from '@angular/forms';
import { CoachesapiService } from './coachesapi.service';

const routes:Routes = [

  { path:'coachesfilter', component:CoachesfiltercoachesComponent}
]

@NgModule({
  declarations: [CoachesfiltercoachesComponent],
  imports: [
    CommonModule,
   
    CoreSidebarModule,
    RouterModule.forChild(routes),
    
    FormsModule
  ],
  providers: [CoachesapiService]
})
export class CoachesmoduleModule { }
