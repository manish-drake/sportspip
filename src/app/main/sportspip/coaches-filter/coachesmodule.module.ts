import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachesfiltercoachesComponent } from './coachesfiltercoaches.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreSidebarModule } from '@core/components';
import { FormsModule } from '@angular/forms';
import { CoachesapiService } from './coachesapi.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AddCoachComponent } from './add-coach/add-coach.component';

const routes:Routes = [

  { path:'coachesfilter', component:CoachesfiltercoachesComponent},
  {path:"add-coach", component:AddCoachComponent }
];

@NgModule({
  declarations: [CoachesfiltercoachesComponent, AddCoachComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes),
  NgbModule, CoreCommonModule,
  ContentHeaderModule,
  FormsModule,CoreSidebarModule
  ],
  providers: [CoachesapiService]
})
export class CoachesmoduleModule { }
