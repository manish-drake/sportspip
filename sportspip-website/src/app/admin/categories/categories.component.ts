import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  loadingData: Boolean = false;
  apiURL: string = '';
  sports: any = [];
  levels: any = [];
  years: any = [];
  programs: any = [];
  sportName: string = '';
  levelName: string = '';
  programName: string = '';
  yearName: string = '';

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.apiURL = this.apiService.getApiUrl();
    this.FetchCategory("sports");
    this.FetchCategory("levels");
    this.FetchCategory("years");
    this.FetchCategory("programs");
  }

  FetchCategory(apiName: string): void {
    this.apiService.getItems(apiName)
      .subscribe(
        (data) => {
          if (apiName === "sports") {
            this.sports = data;
            this.sportName = '';
          }
          if (apiName === "levels") {
            this.levels = data;
            this.levelName = '';
          }
          if (apiName === "programs") {
            this.programs = data;
            this.programName = '';
          }
          if (apiName === "years") {
            this.years = data;
            this.yearName = '';
          }
        },
        (error) => {
          console.log("Error; get sports data: ", error);
        }
      );
  }

  AddItem(apiName: string, value: string): void {
    console.log(apiName + "   " + value);
    console.log(this.isValid(apiName, value)); 
    if (!this.isValid(apiName, value)) {
      this.openSnackBar(apiName + " name should be unique!", "Error");
    }
    else if (value.trim() !== '') {
      this.loadingData = true;
      let item = { Name: value.trim() };
      this.apiService.addItem(apiName, item)
        .subscribe(
          (data) => {
            this.loadingData = false;
            this.FetchCategory(apiName);
            this.openSnackBar("Item added successfully!", "");
          },
          (error) => {
            console.log("Error; add " + apiName + " data: ", error);
            this.loadingData = false;
          }
        );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  isValid(apiName: string, value: string): boolean {
    let isvalid = true;
    if (apiName === "sports") {
      let idx = this.sports.findIndex(elem => {
        return elem.Name.trim() === value.trim()
      })
      if (idx !== -1) {
        isvalid = false;
      }
    }
    if (apiName === "levels") {
      let idx = this.levels.findIndex(elem => {
        return elem.Name.trim() === value.trim()
      })
      if (idx !== -1) {
        isvalid = false;
      }
    }
    if (apiName === "programs") {
      let idx = this.programs.findIndex(elem => {
        return elem.Name.trim() === value.trim()
      })
      if (idx !== -1) {
        isvalid = false;
      }
    }
    if (apiName === "years") {
      let idx = this.years.findIndex(elem => {
        return elem.Name.trim() === value.trim()
      })
      if (idx !== -1) {
        isvalid = false;
      }
    }

    return isvalid;
  }


}
