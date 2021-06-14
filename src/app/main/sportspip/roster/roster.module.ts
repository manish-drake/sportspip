import { NgModule } from '@angular/core';

import { CommonModule} from '@angular/common';

//import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from 'app/main/forms/forms.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RosterComponent } from './roster.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { RosterService } from './roster.service';
//import { BrowserModule } from '@angular/platform-browser';


// routing
const routes: Routes = [
  // { path: 'roster', component : RosterComponent }
  {
    path: 'roster',
    component: RosterComponent,
    data: { animation: 'roster' }
  }
];

@NgModule({
  declarations: [RosterComponent],
  imports: [
   
    CommonModule, RouterModule.forChild(routes),
    NgbModule, CoreCommonModule,
    ContentHeaderModule, MediaPlayerModule, CardSnippetModule
  ],
  providers:[RosterService]
})
export class RosterModule { }
