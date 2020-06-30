import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  updateItem: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      // console.log(params.id);
      if (params.id !== undefined) {
        this.coachId = params.id;
        if (this.coachId.trim() === "0" || this.coachId.trim() === "") {
          this.updateItem = false;
        }
      }
      else {
        this.updateItem = false;
      }
    });
  }

  ngOnInit(): void {
    this.apiURL = this.apiService.getApiUrl();
    if (this.updateItem) {
      this.FetchItem();
    }
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
          //console.log(this.coach.years.map(e => e.id));
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
          //console.log(data);
          this.coach = data;
        },
        (error) => {
          console.log("Error; update coach data: ", error);
          this.loadingData = false;
        }
      );
  }

  AddItem(): void {
    this.loadingData = true;
    this.coach.sports = this.selectedGame;
    this.coach.levels = this.selectedLevel;
    this.coach.programs = this.selectedProgram;
    this.coach.years = this.selectedYear;
    this.apiService.addItem('coaches', this.coach)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.coach = data;
          this.openSnackBar("Item added successfully!", "");
          this.router.navigate(['/admin/coach', this.coach.id]);
        },
        (error) => {
          console.log("Error; add coach data: ", error);
          this.loadingData = false;
        }
      );
  }

  uploadFile(e) {
    //console.log(e.target.files);
    const uploadFile = new FormData();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadFile.append('files', file);
      this.apiService.addItem('upload/', uploadFile)
        .subscribe(
          (data) => {
            this.coach.ProfileImage = data[0];
          },
          (error) => {
            console.log("Error; upload file data: ", error);
          }
        );
    }
  }
}
