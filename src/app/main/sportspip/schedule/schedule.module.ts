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
import { ScheduleComponent } from './schedule.component';
import { ScheduleFilterComponent } from './schedule-filter/schedule-filter.component';
import { ScheduleEventComponent } from './schedule-event/schedule-event.component';
import { ScheduleService } from './schedule.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);
const routes: Routes = [
  
  { 
    path: 'schedule',component: ScheduleComponent,
  resolve: {
    data: ScheduleService
  },
  data: { animation: 'schedule' }
}
];
@NgModule({
  declarations: [ScheduleComponent, ScheduleFilterComponent, ScheduleEventComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    NgbModule,
    CoreSidebarModule,
    FormsModule,
    FullCalendarModule,
    Ng2FlatpickrModule,
    CoreCommonModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  providers: [ScheduleService]
})
export class ScheduleModule { }
