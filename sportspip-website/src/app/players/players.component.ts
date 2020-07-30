import { Component, OnInit, Pipe, PipeTransform, TemplateRef, Type } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../overlay.service';
import { PlayerComponent } from '../player/player.component';


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
    // console.log(years);
    return items.filter(item => {
      let itemMatched = false;
      if (years.length > 0) {
        console.log(years);
        console.log(item.years);
        years.forEach(key => {
          if (item.years.length > 0) {
            if (item.years.indexOf(key) >= 0) {
              itemMatched = true;
            }
            // item.years.forEach(year => {
            //   if (year.Name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
            //     itemMatched = true;
            //   }
            // });
          }
        });
      }
      if (levels.length > 0) {
        levels.forEach(key => {
          if (item.level) {
            if (item.level.id == key) {
              itemMatched = true;
            }
          }
        });
      }
      if (programs.length > 0) {
        console.log(programs);
        console.log(item.program);
        programs.forEach(key => {
          if (item.program) {
            if (item.program.id == key) {
              itemMatched = true;
            }
          }
        });
      }
      if (sports.length > 0) {
        sports.forEach(key => {
          if (item.sport) {
            if (item.sport.id == key) {
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
  constructor(private apiService: ApiService) { }
  transform(items: any[], order = '', lstItems: any[] = []): any[] {
    console.log("order  " + order);
    if (order.indexOf("_lst") !== -1) {

      if (order.indexOf("_desc") === -1) {
        order = order.slice(0, order.indexOf("_"));
        console.log(order);
        console.log(items[0][order]);
        return items.slice().sort((a, b) => {
          console.log(lstItems.find(element => element.id === a[order][0]));
          console.log(lstItems.find(element => element.id === b[order][0]));
          let eleA = lstItems.find(element => element.id === a[order][0]);
          let eleB = lstItems.find(element => element.id === b[order][0]);

          return eleA.Name.localeCompare(eleB.Name);
        });
      }
      else {
        order = order.slice(0, order.indexOf("_"));
        return items.slice().sort((a, b) => lstItems.find(element => element.id === a[order][0]).Name.localeCompare(lstItems.find(element => element.id === b[order][0]).Name)).reverse();
      }
    }
    else if (order.indexOf("_obj") !== -1) {
      if (order.indexOf("_desc") === -1) {
        order = order.slice(0, order.indexOf("_"));
        console.log(order);
        return items.slice().sort((a, b) => {
          console.log(a);
          console.log(b)
          return a[order].Name.localeCompare(b[order].Name);
        });
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
  styleUrls: ['./players.component.css'],
  providers: [SortPlayerPipe]
})
export class PlayersComponent implements OnInit {

  apiURL: string = '';
  apiURLOthr: string = '';
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
  isAscending: Boolean = true;
  playerComponent: Type<any> = PlayerComponent;

  constructor(private apiService: ApiService, private router: Router, private sortPlayer: SortPlayerPipe, private overlayService: OverlayService) { }

  ngOnInit(): void {
    this.apiURL = this.apiService.getPlayerApiUrl();
    this.apiURLOthr = this.apiService.getApiUrl();
    this.FetchItems();    
  }

  sortAscDesc(type: string): void {
    console.log(type);
    if (type === 'desc') {
      this.isAscending = true;
      this.items = this.sortPlayer.transform(this.items, this.sortplayerOrder + "_desc", this.years);
    }
    else {
      this.isAscending = false;
      this.items = this.sortPlayer.transform(this.items, this.sortplayerOrder, this.years);
    }
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('players', this.apiURL)
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
    this.apiService.getItems('years', this.apiURLOthr)
      .subscribe(
        (data) => {
          this.years = data;
        },
        (error) => {
          console.log("Error; get years data: ", error);
        }
      );
  }

  goToPlayer(id: any) {
    this.router.navigate(['/player', id]);
  }

  updateSportsFilter(emittedValue) {
    this.selectedGame = emittedValue;
  }

  updateLevelsFilter(emittedValue) {
    this.selectedLevel = emittedValue;
  }

  updateProgramsFilter(emittedValue) {
    this.selectedProgram = emittedValue;
  }

  updateYearsFilter(emittedValue) {
    this.selectedYear = emittedValue;
  }
  open(content: TemplateRef<any> | ComponentType<any> | string, data: any = {}) {
    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {
      let formData = res.data;
    });
  }
}
