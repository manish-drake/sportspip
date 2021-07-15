import { NgModule } from '@angular/core';

import { CommonModule} from '@angular/common';

//import { CommonModule } from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule  } from 'app/main/forms/forms.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RosterComponent } from './roster.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { MediaPlayerModule } from 'app/main/extensions/media-player/media-player.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { RosterService } from './roster.service';
import { DeleteRosterComponent } from './deleteRoster/delete-roster.component';
import { UpdateRosterComponent } from './update-roster/update-roster.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClientModule } from '@angular/common/http';


//import { BrowserModule } from '@angular/platform-browser';


// routing
const routes: Routes = [
  // { path: 'roster', component : RosterComponent }
  {
    path: 'roster',
    component: RosterComponent,
    data: { animation: 'roster' }
  },
 // {path:"add-roster", component:AddRosterComponent},
  {path:"delete-roster/:id", component:DeleteRosterComponent},
  {path:"update-roster/:id", component:UpdateRosterComponent}
];

@NgModule({
  declarations: [RosterComponent, UpdateRosterComponent],
  imports: [ 
   
    CommonModule, RouterModule.forChild(routes),
    NgbModule, CoreCommonModule,
    ContentHeaderModule, MediaPlayerModule, HttpClientModule, FormsModule,
    SweetAlert2Module.forRoot()

  ],
  providers:[RosterService]
})
export class RosterModule { }
