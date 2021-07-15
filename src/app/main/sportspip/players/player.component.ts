import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../interfaces';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  serverUri:string = "http://192.168.10.50:1337";

  public contentHeader: object;

  constructor(private _playerService : PlayerService) { }

  player:IPlayer[];

  ngOnInit(): void {

    this._playerService.getPlayer().subscribe(data=> this.player = data)

     // content header
     this.contentHeader = {
      headerTitle: 'Players',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          // {
          //   name: '',
          //   isLink: true,
          //   link: '/'
          // },
          {
            name: 'Players',
            isLink: false
          }
        ]
      }
    };
    
  }

}
