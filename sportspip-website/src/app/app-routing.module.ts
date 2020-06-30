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
import { PlayerslistComponent } from './admin/player/playerslist/playerslist.component';
import { AddeditplayerComponent } from './admin/player/addeditplayer/addeditplayer.component'


const routes: Routes = [{ path: '', component: PipsComponent },
{ path: 'pips', component: PipsComponent },
{ path: 'coaches', component: CoachesComponent },
{ path: 'coach/:id', component: CoachComponent },
{ path: 'players', component: PlayersComponent },
{ path: 'player/:id', component: PlayerComponent },
{ path: 'filter', component: FiltersidebarComponent },
{ path: 'admin/coaches', component: CoacheslistComponent },
{ path: 'admin/coach/add', component: UpdatecoachComponent },
{ path: 'admin/coach/:id', component: UpdatecoachComponent },
{ path: 'admin/players', component: PlayerslistComponent },
{ path: 'admin/player/add', component: AddeditplayerComponent },
{ path: 'admin/player/:id', component: AddeditplayerComponent },
{ path: '', redirectTo: '', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
