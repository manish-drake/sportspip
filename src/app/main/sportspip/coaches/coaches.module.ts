import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CoachesComponent } from 'app/main/sportspip/coaches/coaches.component';
import { CoachesFilterComponent } from './coaches-filter/coaches-filter.component';
import { CoachesService } from './coaches.service';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule } from '@core/components';
import { FormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes:Routes = [

  { path:'coaches', component:CoachesComponent,
  // resolve: {
  //   data: CoachesService
  // },
  // data: { animation: 'coaches' },
}
]
@NgModule({
  declarations: [CoachesComponent,CoachesFilterComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),
    CoreCommonModule,
    CoreSidebarModule,
    FormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    NgbModule,
    ContentHeaderModule
    

  ],
  providers: [CoachesService]
  
})
export class CoachesModule { }
