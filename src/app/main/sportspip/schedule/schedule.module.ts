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

import { ScheduleEventSidebarComponent } from 'app/main/sportspip/schedule/schedule-sidebar/schedule-event-sidebar/schedule-event-sidebar.component';
import { ScheduleMainSidebarComponent } from 'app/main/sportspip/schedule/schedule-sidebar/schedule-main-sidebar/schedule-main-sidebar.component';

import { ScheduleComponent } from 'app/main/sportspip/schedule/schedule.component';
import { ScheduleService } from 'app/main/sportspip/schedule/schedule.service';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

// routing
const routes: Routes = [
  {
    path: '**',
    component: ScheduleComponent,
    resolve: {
      data: ScheduleService
    },
    data: { animation: 'schedule' }
  }
];

@NgModule({
  declarations: [ScheduleComponent, ScheduleEventSidebarComponent, ScheduleMainSidebarComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    CoreSidebarModule,
    FormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [ScheduleService]
})
export class ScheduleModule {}
