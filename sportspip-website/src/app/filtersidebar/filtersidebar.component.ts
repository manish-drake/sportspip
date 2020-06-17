import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-filtersidebar',
  templateUrl: './filtersidebar.component.html',
  styleUrls: ['./filtersidebar.component.css']
})
export class FiltersidebarComponent implements OnInit {

  typesOfShoes: any[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
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
    this.FetchItems();    
  }

  FetchItems(): void {   
    this.apiService.getItems('sports')
      .subscribe(
        (data) => {
          this.sports = data;
        },
        (error) => {
          console.log("Error; get sports data: ", error);
        }
      );
    this.apiService.getItems('levels')
      .subscribe(
        (data) => {
          this.levels = data;
        },
        (error) => {
          console.log("Error; get levels data: ", error);
        }
      );
    this.apiService.getItems('years')
      .subscribe(
        (data) => {
          this.years = data;
        },
        (error) => {
          console.log("Error; get years data: ", error);
        }
      );
    this.apiService.getItems('programs')
      .subscribe(
        (data) => {
          this.programs = data;
        },
        (error) => {
          console.log("Error; get programs data: ", error);
        }
      );
  }

}
