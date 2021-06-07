import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AddEventsComponent } from './add-events.component';
import { CalendarModule } from 'app/main/apps/calendar/calendar.module';
import { CoreCommonModule } from '@core/common.module';


const routes: Routes = [

  { path: 'addevents', component: AddEventsComponent}
];

@NgModule({
  declarations: [AddEventsComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    CommonModule, RouterModule.forChild(routes),
    CalendarModule
  ]
})
export class AddeventModule { }
