import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events.component';


const routes:Routes = [

  { path:'event', component:EventsComponent}
]

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes)
  ]
})
export class EventModule { }
