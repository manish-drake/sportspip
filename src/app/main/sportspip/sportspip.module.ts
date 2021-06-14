import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { NgSelectModule } from '@ng-select/ng-select';
import { TaggingModule } from './tagging/tagging.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './events/event.module';
import { AddEventModule } from './add-events/add-event.module';
import { MediaPlayerModule } from '../extensions/media-player/media-player.module';

import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

//import { ScheduleModule } from './schedule/schedule.module'
import { CoachesModule } from './coaches/coaches.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { ActivityModule } from './activity/activity.module';
import { MediaComponent } from './media/media.component';
import { MediaModule } from './media/media.module';
import { AnalysisComponent } from './analysis/analysis.component';
import { AnalysisModule } from './analysis/analysis.module';
import { SetupComponent } from './setup/setup.component';
import { SetupModule } from './setup/setup.module';
import { SupportComponent } from './support/support.component';
import { SupportModule } from './support/support.module';
import { ScheduleModule } from './schedule/schedule.module';
import { TeamDetailsModule } from './team-details/team-details.module';


import { CoachDetailsModule } from './coach-details/coach-details.module';
import { PlayerDetailsModule } from './player-details/player-details.module';

import { RosterModule } from './roster/roster.module';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleListModule } from './schedule-list/schedule-list.module';







FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  
  declarations: [ ScheduleListComponent],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgSelectModule,
    TaggingModule,
    ReviewModule,
    EventModule,
    AddEventModule,
    CoachesModule,
    MediaPlayerModule,
    TeamsModule,
    PlayersModule,
    ActivityModule,
    MediaModule,
    AnalysisModule,
    SetupModule,
    SupportModule,
    ScheduleModule,
    TeamDetailsModule,
    RouterModule,
    TeamDetailsModule,
    PlayerDetailsModule,
    CoachDetailsModule,
    CoachDetailsModule,
    RosterModule,
    ScheduleListModule
    
   
  ],
  exports: [],
 
 
})
export class SportspipModule { }



