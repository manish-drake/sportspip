import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-updatecoach',
  templateUrl: './updatecoach.component.html',
  styleUrls: ['./updatecoach.component.css']
})
export class UpdatecoachComponent implements OnInit {

  loadingData: Boolean = false;
  apiURL: string = '';
  coachId: string = '';
  coach: any = {};
  sports: any = [];
  levels: any = [];
  years: any = [];
  programs: any = [];
  selectedProgram: any = [];
  selectedYear: any = [];
  selectedGame: any = [];
  selectedLevel: any = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.route.params.subscribe(params => this.coachId = params.id);
  }

  ngOnInit(): void {
    this.apiURL = this.apiService.getApiUrl();
    this.FetchItem();
    this.FetchCategory("sports");
    this.FetchCategory("levels");
    this.FetchCategory("years");
    this.FetchCategory("programs");
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  FetchItem(): void {
    this.loadingData = true;
    this.apiService.getItemById('coaches', this.coachId)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.coach = data;
          console.log(this.coach.years.map(e => e.id));
          this.selectedGame = this.coach.sports.map(e => e.id);
          this.selectedLevel = this.coach.levels.map(e => e.id);
          this.selectedProgram = this.coach.programs.map(e => e.id);
          this.selectedYear = this.coach.years.map(e => e.id);
          // this.years = this.coach.years.map(e => e.Name).join(", ");
        },
        (error) => {
          console.log("Error; get coach data: ", error);
          this.loadingData = false;
        }
      );
  }

  FetchCategory(apiName: string): void {
    this.apiService.getItems(apiName)
      .subscribe(
        (data) => {
          if (apiName === "sports") {
            this.sports = data;
          }
          if (apiName === "levels") {
            this.levels = data;
          }
          if (apiName === "programs") {
            this.programs = data;
          }
          if (apiName === "years") {
            this.years = data;
          }
        },
        (error) => {
          console.log("Error; get sports data: ", error);
        }
      );
  }

  UpdateItem(): void {
    this.loadingData = true;
    this.coach.sports = this.selectedGame;
    this.coach.levels = this.selectedLevel;
    this.coach.programs = this.selectedProgram;
    this.coach.years = this.selectedYear;
    this.apiService.updateItem('coaches', this.coach)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.openSnackBar("Item updated successfully!", "");
          console.log(data);
          this.coach = data;
          // console.log(this.coach.years.map(e => e.id));
          // this.selectedGame = this.coach.sports.map(e => e.id);
          // this.selectedLevel = this.coach.levels.map(e => e.id);
          // this.selectedProgram = this.coach.programs.map(e => e.id);
          // this.selectedYear = this.coach.years.map(e => e.id);
          // this.years = this.coach.years.map(e => e.Name).join(", ");
        },
        (error) => {
          console.log("Error; update coach data: ", error);
          this.loadingData = false;
        }
      );
  }
}
