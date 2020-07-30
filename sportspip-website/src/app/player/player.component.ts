import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../service/api.service';
import { OverlayHandle } from '../overlay-handle';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  loadingData: Boolean = false;
  apiURL: string = '';
  playerId: string = '';
  player: any = {};
  // sports: string = '';
  // levels: string = '';
  // programs: string = '';
  // years: string = '';

 constructor(private route: ActivatedRoute, private apiService: ApiService, private handle: OverlayHandle) {
    // this.route.params.subscribe(params => this.playerId = params.id);
    this.player = handle.data;
  }

  ngOnInit(): void {
    this.apiURL = this.apiService.getPlayerApiUrl();
    //this.FetchItem();    
  }

  FetchItem(): void {
    this.loadingData = true;
    this.apiService.getItems('players/' + this.playerId)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.player = data;
          //console.log(this.player.sports);
          // this.sports = this.player.sports.map(e => e.Name).join(", ");
          // this.levels = this.player.levels.map(e => e.Name).join(", ");
          // this.programs = this.player.programs.map(e => e.Name).join(", ");
          // this.years = this.player.years.map(e => e.Name).join(", ");
        },
        (error) => {
          console.log("Error; get player data: ", error);
          this.loadingData = false;
        }
      );
  }
  close() {
    this.handle.close(null);
  }

}
