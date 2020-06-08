import { Component, OnInit, Pipe, PipeTransform, Injectable } from '@angular/core';
import { ApiService } from '../service/api.service';

@Pipe({
  name: 'filtersport'
})
export class FiltersportPipe implements PipeTransform {
  transform(items: any[], value: any[]): any[] {
    //console.log("value");
    if (!items) {
      return [];
    }
    if (value.length <= 0) {
      return items;
    }
    //console.log(value);
    //let keys: any[] = ['Title', 'FirstName', 'LastName'];
    return items.filter(item => {
      let itemMatched = false;
      value.forEach(key => {
        if (item.sports.length > 0) {
          item.sports.forEach(sport => {
            if (sport.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          });
        }
        //console.log(key);
        //console.log(item.sports.length);
         
      });
      return itemMatched;
    });
  }
}

@Pipe({
  name: 'filterlevel'
})
export class FilterlevelPipe implements PipeTransform { 
  transform(items: any[], value: any[]): any[] {
    //console.log("value");
    if (!items) {
      return [];
    }
    if (value.length <= 0) {
      return items;
    }
    //console.log(value);
    //let keys: any[] = ['Title', 'FirstName', 'LastName'];
    return items.filter(item => {
      let itemMatched = false;
      value.forEach(key => {
        if (item.levels.length > 0) {
          item.levels.forEach(level => {
            if (level.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          });
        } 
      });
      return itemMatched;
    });
  }
}

@Pipe({
  name: 'filteryear'
})
export class FilteryearPipe implements PipeTransform { 
  transform(items: any[], value: any[]): any[] {
    //console.log("value");
    if (!items) {
      return [];
    }
    if (value.length <= 0) {
      return items;
    }
    //console.log(value);
    //let keys: any[] = ['Title', 'FirstName', 'LastName'];
    return items.filter(item => {
      let itemMatched = false;
      value.forEach(key => {
        if (item.years.length > 0) {
          item.years.forEach(year => {
            if (year.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          });
        } 
      });
      return itemMatched;
    });
  }
}

@Pipe({
  name: 'filterprogram'
})
export class FilterprogramPipe implements PipeTransform { 
  transform(items: any[], value: any[]): any[] {
   // console.log("value");
    if (!items) {
      return [];
    }
    if (value.length <= 0) {
      return items;
    }
    //console.log(value);
    //let keys: any[] = ['Title', 'FirstName', 'LastName'];
    return items.filter(item => {
      let itemMatched = false;
      value.forEach(key => {
        if (item.programs.length > 0) {
          item.programs.forEach(program => {
            if (program.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          });
        } 
      });
      return itemMatched;
    });
  }
}

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.css']
})

export class CoachesComponent implements OnInit {

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
  loadingData: Boolean = false;

  constructor(private apiService : ApiService) { }

  ngOnInit(): void {
    this.FetchItems();
    this.apiURL = this.apiService.getApiUrl();
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('coaches')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
        },
        (error) => {
          console.log("Error; get coaches data: ", error);
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

  FormatDate(value) {
    var st = value;
    let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    let date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
    return date;
  }
}
