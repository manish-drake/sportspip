import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';

import { ScheduleComponent } from  './schedule.component';//'./schedule.component';
import { ScheduleEventSidebarComponent } from './schedule-sidebar/schedule-event-sidebar/schedule-event-sidebar.component';
import { ScheduleMainSidebarComponent } from './schedule-sidebar/schedule-main-sidebar/schedule-main-sidebar.component';
import {ScheduleService} from './schedule.service';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);
const routes: Routes = [
  
  { path: 'schedule',component: ScheduleComponent,

  resolve: {
          data: ScheduleService
        },
        data: { animation: 'schedule' }
      }


];
@NgModule({
  declarations: [ScheduleComponent,ScheduleEventSidebarComponent, ScheduleMainSidebarComponent],
  imports: [
    CommonModule,
  
    CommonModule,
    FullCalendarModule,
   
    CoreCommonModule,
    CoreSidebarModule,
    FormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    NgbModule
  ],
  providers:[ScheduleService]
})
export class ScheduleModule { }
