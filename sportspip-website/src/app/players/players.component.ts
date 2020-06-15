import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  apiURL: string = '';
  items: any = [];
  sports: any = [];
  levels: any = [];
  years: any = [];
  programs: any = [];
  selectedProgram: any = '';
  selectedYear: any = '';
  selectedGame: any = '';
  selectedLevel: any = '';
  sortplayerOrder: string = 'LastName';
  loadingData: Boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.FetchItems();
    this.apiURL = this.apiService.getApiUrl();
  }

  FetchItems(): void {
    this.loadingData = true;  
    this.apiService.getItems('players')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
        },
        (error) => {
          console.log("Error; get players data: ", error);
          this.loadingData = false;
        }
      );
      this.apiService.getItems('sports')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.sports = data;
        },
        (error) => {
          console.log("Error; get sports data: ", error);
          this.loadingData = false;
        }
      );
      this.apiService.getItems('levels')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.levels = data;
        },
        (error) => {
          console.log("Error; get levels data: ", error);
          this.loadingData = false;
        }
      );
      this.apiService.getItems('years')
      .subscribe(
        (data) => {
          this.loadingData = false;
          //console.log(data);
          this.years = data;
        },
        (error) => {
          console.log("Error; get years data: ", error);
          this.loadingData = false;
        }
      );
      this.apiService.getItems('programs')
      .subscribe(
        (data) => {
          this.loadingData = false;
          //console.log(data);
          this.programs = data;
        },
        (error) => {
          console.log("Error; get programs data: ", error);
          this.loadingData = false;
        }
      );
  }


}
