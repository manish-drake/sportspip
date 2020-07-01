import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipsComponent } from './pips/pips.component';
import { CoachesComponent } from './coaches/coaches.component';
import { CoachComponent } from './coach/coach.component';
import { PlayersComponent } from './players/players.component';
import { PlayerComponent } from './player/player.component';
import { FiltersidebarComponent } from './filtersidebar/filtersidebar.component';
import { CoacheslistComponent } from './admin/coach/coacheslist/coacheslist.component';
import { UpdatecoachComponent } from './admin/coach/updatecoach/updatecoach.component';
import { Test1Component } from './test1/test1.component';
import { RosterComponent } from './roster/roster.component'


const routes: Routes = [{ path: '', component: PipsComponent },
                        { path: 'pips', component: PipsComponent },
                        { path: 'coaches', component: CoachesComponent },
                        { path: 'coach/:id', component: CoachComponent },
                        { path: 'players', component: PlayersComponent },
                        { path: 'player/:id', component: PlayerComponent },
                        { path: 'filter', component: FiltersidebarComponent },
                        { path: 'admin/coaches', component: CoacheslistComponent },
                        { path: 'admin/coach/:id', component: UpdatecoachComponent },
                        { path: 'test1', component: Test1Component},
                        { path: 'roster', component: RosterComponent },
                        { path: '', redirectTo: '', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
