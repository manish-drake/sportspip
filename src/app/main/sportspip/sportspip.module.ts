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
import { RouterModule, Routes } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TeamsModule } from './teams/teams.module';
import {TeamsComponent} from './teams/teams.component';
import { CoachesComponent } from './coaches/coaches.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityModule } from './activity/activity.module';
import { MediaComponent } from './media/media.component';
import { MediaModule } from './media/media.module';
import { AnalysisComponent } from './analysis/analysis.component';
import { AnalysisModule } from './analysis/analysis.module';
import { SetupComponent } from './setup/setup.component';
import { SetupModule } from './setup/setup.module';
import { SupportComponent } from './support/support.component';
import { SupportModule } from './support/support.module';



FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  declarations: [CoachesComponent, ActivityComponent, MediaComponent, AnalysisComponent, SetupComponent, SupportComponent, ],
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
    TeamsModule,
    ActivityModule,
    MediaModule,
    AnalysisModule,
    SetupModule,
    SupportModule
    
   
  ],
  exports:[]
})
export class SportspipModule { }
function routes(routes: any): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

