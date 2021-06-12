import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';



const routes: Routes = [
  
  { path: 'players',component: PlayerComponent}
];
@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule

  ]
})
export class PlayersModule { }
