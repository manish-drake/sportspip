import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDetailsComponent } from './team-details.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from 'app/main/forms/forms.module';

// routing
const routes: Routes = [
  
  { path: 'teamsdetails', component : TeamDetailsComponent },

];
@NgModule({
  declarations: [TeamDetailsComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  NgbModule, CoreCommonModule,
  ContentHeaderModule,
  FormsModule
  ],
  
  exports:[RouterModule],
})
export class TeamDetailsModule { }
