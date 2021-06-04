import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { TaggingModule } from './tagging/tagging.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './events/event.module';
import { AddEventModule } from './add-events/add-event.module';
import { MediaPlayerModule} from '../extensions/media-player/media-player.module';
import { Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TeamsModule } from './teams/teams.module';
import {TeamsComponent} from './teams/teams.component';
import { ScheduleModule } from './schedule/schedule.module'



FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  declarations: [TeamsComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgSelectModule,
    TaggingModule,
    ReviewModule,
    EventModule,
    EventModule,
    AddEventModule,
    MediaPlayerModule,
    ScheduleModule
    
   
  ],
  exports:[]
})
export class SportspipModule { }
