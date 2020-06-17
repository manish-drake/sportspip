import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiService } from '../service/api.service';

@Pipe({
  name: 'filterplayer'
})
export class FilterPlayerPipe implements PipeTransform {
  transform(items: any[], years: any[], levels: any[], programs: any[], sports: any[]): any[] {
    //console.log("value");
    if (!items) {
      return [];
    }
    if (years.length <= 0 && levels.length <= 0 && programs.length <= 0 && sports.length <= 0) {
      return items;
    }
    //console.log(sports);
    return items.filter(item => {
      let itemMatched = false;
      if (years.length > 0) {
        years.forEach(key => {
          if (item.years.length > 0) {
            item.years.forEach(year => {
              if (year.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                itemMatched = true;
              }
            });
          }
        });
      }
      if (levels.length > 0) {
        levels.forEach(key => {
          if (item.level) {
            if (item.level.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          }
        });
      }
      if (programs.length > 0) {
        programs.forEach(key => {
          if (item.program) {
            if (item.program.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          }
        });
      }
      if (sports.length > 0) {
        sports.forEach(key => {
          if (item.sport) {
            if (item.sport.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
              itemMatched = true;
            }
          }
        });
      }
      
      return itemMatched;
    });
  }
}

@Pipe({
  name: 'sortplayer'
})
export class SortPlayerPipe implements PipeTransform {
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
    else  if (order.indexOf("_obj") !== -1) {
      if (order.indexOf("_desc") === -1) {
        order = order.slice(0, order.indexOf("_"));
        console.log(order);
        return items.slice().sort((a, b) => a[order].Name.localeCompare(b[order].Name));
      }
      else {
        order = order.slice(0, order.indexOf("_"));
        return items.slice().sort((a, b) => a[order].Name.localeCompare(b[order].Name)).reverse();
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
