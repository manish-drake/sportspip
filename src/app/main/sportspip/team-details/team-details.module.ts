import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from 'app/main/forms/forms.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamDetailsComponent } from './team-details.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';
import { GoogleMapModule } from 'app/main/charts-and-maps/google-maps/google-maps.module';
import { ChartsAndMapsModule } from 'app/main/charts-and-maps/charts-and-maps.module';


// routing
const routes: Routes = [
  { path: 'team-details', component : TeamDetailsComponent }

];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    NgbModule, CoreCommonModule,
    ContentHeaderModule, MediaPlayerModule, GoogleMapModule ]
})
export class TeamDetailsModule { }
