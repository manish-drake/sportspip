import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

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
    console.log(items);
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
    console.log(items);
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

@Pipe({
  name: 'sortcoach'
})
export class SortCoachPipe implements PipeTransform {

  transform(items: any[], order = ''): any[] {
    //console.log("order  " + order);
    if (order.indexOf("_lst") !== -1) {

      if (order.indexOf("_desc") === -1) {
        order = order.slice(0, order.indexOf("_"));
        console.log(order);
        return items.slice().sort((a, b) => a[order][0].Name.localeCompare(b[order][0].Name));
      }
      else {
        order = order.slice(0, order.indexOf("_"));
        return items.slice().sort((a, b) => a[order][0].Name.localeCompare(b[order][0].Name)).reverse();
      }

    }
    else if (order.indexOf("_desc") === -1) {
      return items.slice().sort((a, b) => {
        return a[order].localeCompare(b[order]);
      });
    }
    else if (order.indexOf("_desc") !== -1) {
      order = order.slice(0, order.indexOf("_"));
      return items.slice().sort((a, b) => {
        return a[order].localeCompare(b[order]);
      }).reverse();
    }
    else {
      return items;
    }
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
  sortcoachOrder: string = 'LastName';
  loadingData: Boolean = false;

  constructor(private apiService: ApiService, private router: Router) { }

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

  goToCoach(id: any) {
    this.router.navigate(['/coach', id]);
  }
}
