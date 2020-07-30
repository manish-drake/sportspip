import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-filtersidebar',
  templateUrl: './filtersidebar.component.html',
  styleUrls: ['./filtersidebar.component.css']
})
export class FiltersidebarComponent implements OnInit {
  @Output() sportsChanged = new EventEmitter<[]>();
  @Output() levelsChanged = new EventEmitter<[]>();
  @Output() programsChanged = new EventEmitter<[]>();
  @Output() yearsChanged = new EventEmitter<[]>();

  apiURL: string = 'http://localhost:1339';
  selectedOptions: any = [];
  sports: any = [];
  levels: any = [];
  years: any = [];
  programs: any = [];
  selectedProgram: any = [];
  selectedYear: any = [];
  selectedGame: any = [];
  selectedLevel: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.FetchItems("sports");
    this.FetchItems("levels");
    this.FetchItems("years");
    this.FetchItems("programs")
  }

  FetchItems(apiName: string): void {
    this.apiService.getItems(apiName, this.apiURL)
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

  allCheckboxChange(e) {

    if (e.source.id === "sportListAll") {
      this.selectedGame = [];
      if (e.checked) {
        this.sports.forEach(key => {
          this.selectedGame.push(key.id.toString());
        });
      }
      this.sportsChanged.emit(this.selectedGame);
    }
    else if (e.source.id === "levelListAll") {
      this.selectedLevel = [];
      if (e.checked) {
        this.levels.forEach(key => {
          this.selectedLevel.push(key.id.toString());
        });
      }
      this.levelsChanged.emit(this.selectedLevel);
    }
    else if (e.source.id === "programListAll") {
      this.selectedProgram = [];
      if (e.checked) {
        this.programs.forEach(key => {
          this.selectedProgram.push(key.id.toString());
        });
      }
      this.programsChanged.emit(this.selectedProgram);
    }
    else if (e.source.id === "yearListAll") {
      this.selectedYear = [];
      if (e.checked) {
        this.years.forEach(key => {
          this.selectedYear.push(key.id.toString());
        });
      }
      this.yearsChanged.emit(this.selectedYear);
    }
    //console.log(this.selectedGame);
  }

  sportsCheckChange() {
    this.sportsChanged.emit(this.selectedGame);
  }

  levelsCheckChange() {
    this.levelsChanged.emit(this.selectedLevel);
  }

  programsCheckChange() {
    this.programsChanged.emit(this.selectedProgram);
  }

  yearsCheckChange() {
    this.yearsChanged.emit(this.selectedYear);
  }
}
