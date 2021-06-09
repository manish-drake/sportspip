import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { Routes } from '@angular/router';



const routes: Routes = [
  
  { path: 'players',component: PlayerComponent},
];
@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule
  ]
})
export class PlayersModule { }
