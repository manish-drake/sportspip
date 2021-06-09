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
<<<<<<< HEAD

=======
import { RouterModule, Routes } from '@angular/router';
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

//import { ScheduleModule } from './schedule/schedule.module'
import { CoachesModule } from './coaches/coaches.module';
import { TeamsModule } from './teams/teams.module';
<<<<<<< HEAD
import { PlayersModule } from './players/players.module';

=======
import {TeamsComponent} from './teams/teams.component';
import { CoachesComponent } from './coaches/coaches.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityModule } from './activity/activity.module';
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71



FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
<<<<<<< HEAD
  declarations: [],
=======
  declarations: [CoachesComponent, ActivityComponent, ],
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgSelectModule,
    TaggingModule,
    ReviewModule,
    EventModule,
    
    AddEventModule,
   
    //ScheduleModule,
    CoachesModule,
    MediaPlayerModule,
    TeamsModule,
<<<<<<< HEAD
    PlayersModule
=======
    ActivityModule,
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71
    
   
  ],
  exports:[]
})
export class SportspipModule { }
function routes(routes: any): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

