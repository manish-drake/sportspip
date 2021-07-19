import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';



const routes: Routes = [
  
  { path: 'players',component: PlayerComponent}
];
@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,CoreSidebarModule,CoreCommonModule

  ]
})
export class PlayersModule { }
