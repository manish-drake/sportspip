import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IPlayer } from '../interfaces';
import { PlayerService } from '../players/player.service';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class PlayerDetailsComponent implements OnInit {

  playerId:string ="";
  playerDetails: IPlayer;

  constructor(private activatedRoute: ActivatedRoute,private _playerService : PlayerService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.playerId = this.activatedRoute.snapshot.queryParamMap.get('playerId');
      console.log('Url Id: ', this.playerId);

      this._playerService.getPlayerX(this.playerId).subscribe(
        data=> {
          this.playerDetails = data[0] as IPlayer;
          console.log(this.playerDetails);
        }
      );
    });
  }

}
