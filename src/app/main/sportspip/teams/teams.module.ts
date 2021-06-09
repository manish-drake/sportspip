import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { TeamsComponent } from './teams.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';
=======
import { TeamsFilterComponent } from './teams-filter/teams-filter.component';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { RouterModule, Routes } from '@angular/router';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { FormsModule } from 'app/main/forms/forms.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamsComponent } from './teams.component';
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71


// routing
const routes: Routes = [
  { path: 'teams',component: TeamsComponent}

];

const routes: Routes = [
  
  { path: 'teams',component: TeamsComponent},
];

@NgModule({
<<<<<<< HEAD
  declarations: [TeamsComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
    NgbModule, CoreCommonModule, 
    ContentHeaderModule,MediaPlayerModule
  ]
=======
  declarations: [TeamsFilterComponent, TeamsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    CoreSidebarModule,
    FormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [CalendarService]
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71
})
export class TeamsModule { }
