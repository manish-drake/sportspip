import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from 'app/main/forms/forms.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerDetailsComponent } from './player-details.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';


// routing
const routes: Routes = [
  { path: 'player-details', component : PlayerDetailsComponent }

];


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    NgbModule, CoreCommonModule,
    ContentHeaderModule, MediaPlayerModule
  ]
})
export class PlayerDetailsModule { }
