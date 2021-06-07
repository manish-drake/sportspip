import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { TaggingModule } from './tagging/tagging.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './events/event.module';

import { MediaPlayerModule} from '../extensions/media-player/media-player.module';
import { CalendarModule } from '../apps/calendar/calendar.module';
import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AddeventModule } from './add-events/addevent.module';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleModule } from './schedule/schedule.module';


// routing
// const routes: Routes = [
//   {
//     path: 'addevents',
//     loadChildren: () => import('./add-events/add-event.module').then(m => m.AddEventModule)
//   },
  
  
//   {
//     path: 'event',
//     loadChildren: () => import('./events/event.module').then(m => m.EventModule)
//   },
 
 
//   {
//     path: 'tagging',
//     loadChildren: () => import('./tagging/tagging.module').then(m => m.TaggingModule)
//   },
//   {
//     path: 'review',
//     loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
//   },
// ];
// const routes: Routes = [
//   {path: 'events', component: EventModule}
// ];

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgSelectModule,
    TaggingModule,
    ReviewModule,
    EventModule,
    CalendarModule,
    MediaPlayerModule,
   // RouterModule.forRoot(routes)
   AddeventModule,
   ScheduleModule
   
  ],
  exports:[]
})
export class SportspipModule { }
