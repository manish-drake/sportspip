import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipsComponent } from './pips/pips.component';
import { CoachesComponent } from './coaches/coaches.component';
import { CoachComponent } from './coach/coach.component';
import { PlayersComponent } from './players/players.component'


const routes: Routes = [{path:'', component: PipsComponent},
                        {path:'pips', component: PipsComponent},
                        {path:'coaches', component: CoachesComponent},
                        {path:'coach/:id', component: CoachComponent},
                        {path:'players', component: PlayersComponent},
                        {path:'', redirectTo: '', pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
