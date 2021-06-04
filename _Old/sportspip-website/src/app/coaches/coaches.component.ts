import { Component, OnInit, Pipe, PipeTransform, Type, TemplateRef } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { OverlayService } from '../overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { CoachComponent } from '../coach/coach.component';

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
  styleUrls: ['./coaches.component.css'],
  providers: [SortCoachPipe]
})

export class CoachesComponent implements OnInit {

  apiURL: string = '';
  items: any = [];  
  selectedProgram: any = '';
  selectedYear: any = '';
  selectedGame: any = '';
  selectedLevel: any = '';
  sortcoachOrder: string = 'LastName';
  loadingData: Boolean = false;
  isAscending: Boolean = true;
  coachComponent: Type<any> = CoachComponent;

  constructor(private apiService: ApiService, private router: Router, private sortCoach: SortCoachPipe, private overlayService: OverlayService) { }

  ngOnInit(): void {
    this.FetchItems();
    this.apiURL = this.apiService.getApiUrl();
  }

  sortAscDesc(type: string): void {
    console.log(type);
    if (type === 'desc') {
      this.isAscending = true;
      this.items = this.sortCoach.transform(this.items, this.sortcoachOrder + "_desc");
    }
    else {
      this.isAscending = false;
      this.items = this.sortCoach.transform(this.items, this.sortcoachOrder);
    }
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
  open(content: TemplateRef<any>|ComponentType<any>|string, data: any = {}) {
    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {
      let formData = res.data;
    });
  }
}
