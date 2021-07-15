import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { FormsModule } from 'app/main/forms/forms.module';
import { UpdateEventComponent } from './update-event/update-event.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';


const routes:Routes = [

  { path:'event', component:EventsComponent},
  { path:'update-event', component:UpdateEventComponent},
  { path:'delete-event', component:DeleteEventComponent}
]

@NgModule({
  declarations: [EventsComponent, UpdateEventComponent, DeleteEventComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  NgbModule, CoreCommonModule,
  ContentHeaderModule,
  FormsModule
  ]

})
export class EventModule { }

