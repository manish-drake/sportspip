import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  loadingDatalevel: Boolean = false;
  loadingDatasport: Boolean = false;
  loadingDataprogram: Boolean = false;
  loadingDatayear: Boolean = false;
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

  showhideloading(apiName: string, value: boolean): void {
    if (apiName === "sports") {
      this.loadingDatasport = value;
    }
    if (apiName === "levels") {
      this.loadingDatalevel = value;
    }
    if (apiName === "programs") {
      this.loadingDataprogram = value;
    }
    if (apiName === "years") {
      this.loadingDatayear = value;
    }
  }

  FetchCategory(apiName: string): void {
    this.showhideloading(apiName, true);
    this.apiService.getItems(apiName, this.apiURL)
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
          this.showhideloading(apiName, false);
        },
        (error) => {
          console.log("Error; get sports data: ", error);
        }
      );
  }

  AddItem(apiName: string, value: string): void {
    if (!this.isValid(apiName, value)) {
      this.openSnackBar(apiName + " name should be unique!", "Error");
    }
    else if (value.trim() !== '') {
      this.showhideloading(apiName, true);
      let item = { Name: value.trim() };
      this.apiService.addItem(apiName, item, this.apiURL)
        .subscribe(
          (data) => {
            this.showhideloading(apiName, false);
            this.FetchCategory(apiName);
            this.openSnackBar("Item added successfully!", "");
          },
          (error) => {
            console.log("Error; add " + apiName + " data: ", error);
            this.showhideloading(apiName, false);
          }
        );
    }
  }

  UpdateItem(apiName: string, item: any): void {
    this.showhideloading(apiName, true);
    this.apiService.updateItem(apiName, item, this.apiURL)
      .subscribe(
        (data) => {
          this.showhideloading(apiName, false);
          this.FetchCategory(apiName);
          this.openSnackBar("Item updated successfully!", "");
        },
        (error) => {
          console.log("Error; update " + apiName + " data: ", error);
          this.openSnackBar(apiName + " name should be unique!", "Error");
          this.showhideloading(apiName, false);
        }
      );
  }

  DeleteItem(apiName: string, id: any) {
    this.showhideloading(apiName, true);
    this.apiService.deleteItem(apiName, id, this.apiURL)
      .subscribe(
        (_data) => {
          this.showhideloading(apiName, false);
          this.FetchCategory(apiName);
          this.openSnackBar("Item deleted successfully!", "");
        },
        (error) => {
          console.log("Error; delete roster data: ", error);
        }
      );
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
