import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from 'app/main/forms/forms.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamsComponent } from './teams.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';
import { TeamsService } from './teams.service';
import { CoachesFilterComponent } from '../coaches/coaches-filter/coaches-filter.component';
import { TeamDetailsComponent } from '../team-details/team-details.component';
import { UpdateTeamComponent } from './update-team/update-team.component';
import { DeleteTeamComponent } from './delete-team/delete-team.component';


// routing
const routes: Routes = [
  { path: 'teams', component : TeamsComponent },
  {path:"delete-team", component:DeleteTeamComponent},
  {path:"update-team", component:UpdateTeamComponent} 
];



@NgModule({
  declarations: [TeamsComponent, UpdateTeamComponent, DeleteTeamComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    NgbModule, CoreCommonModule, BrowserModule,
    ContentHeaderModule, MediaPlayerModule,
    
  ],
  providers: [TeamsService],
  exports: [RouterModule],
  bootstrap: [UpdateTeamComponent]

})
export class TeamsModule { }
