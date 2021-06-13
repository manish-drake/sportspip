import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDetailsComponent } from './team-details.component';
import { RouterModule, Routes } from '@angular/router';

// routing
const routes: Routes = [
  
  { path: 'teamsdetails', component : TeamDetailsComponent },

];
@NgModule({
  declarations: [TeamDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
 
  ],
  exports:[RouterModule],
})
export class TeamDetailsModule { }
