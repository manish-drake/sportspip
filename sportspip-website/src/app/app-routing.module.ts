import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipsComponent } from './pips/pips.component';


const routes: Routes = [{path:'', component: PipsComponent},
                        {path:'pips', component: PipsComponent},
                        {path:'', redirectTo: '', pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
