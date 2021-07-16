import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import {  ICoaches, ILevel, IProgram } from '../../interfaces';
import { CoachesService } from '../coaches.service';

@Component({
  selector: 'app-coaches-filter',
  templateUrl: './coaches-filter.component.html',
  styleUrls: ['./coaches-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoachesFilterComponent implements OnInit {

   // Public
   public coachesRef = [];
   public tempRef = [];
   public checkAll = true;
   public levelsRef=[];

  constructor(private _coreSidebarService: CoreSidebarService,private _coachesService: CoachesService) { }


    ngOnInit(): void {
      this.dataFilter();
      this.filterCoach();
   }
 
  //--------------------------subscribed data for for checkbox-----------------------------//

  gameFilter: any = [];

  dataFilter() {
    this._coachesService.filterData().subscribe((data: any[]) => {
      console.log(data);
      this.gameFilter = data;
      console.log(this.gameFilter);
    });
  }

  //----------------------subscribed coach data-----------------------------//
  coachesArray: any = [];
  arrays: any = [];

  filterCoach() {
    this._coachesService.coachesData().subscribe((data: any[]) => {
      console.log(data);
      this.coachesArray = data;
      this.arrays = this.coachesArray;
      console.log(this.coachesArray)
    });
  }


  toggleCheckboxAll(event) {



    if (event.target.checked) {
      this.tempArray = this.arrays;
      this.coachesArray = [];

      this.newArray.push(this.tempArray);

      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.coachesArray.push(obj);
          console.log(this.coachesArray)
        }
      }
    }
    else {
      this.coachesArray = [];
    }

    //--------------------------toggle-------------------------//


    this.checkAll = event.target.checked;
    if (this.checkAll) {
      this.gameFilter.map(res => {
        res.checked = true;
      });
    } else {
      this.gameFilter.map(res => {
        res.checked = false;
      });
    }

  }


  //logic for filter coach 
  tempArray: any = [];
  newArray: any = [];

  onChange(event: any, id) {

    if (event.target.checked) {
      this.tempArray = this.arrays.filter((e: any) => e.filter == event.target.value);
      this.coachesArray = [];

      this.newArray.push(this.tempArray);

      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.coachesArray.push(obj);
          console.log(this.coachesArray)
        }
      }
    }

    else {

      this.tempArray = this.coachesArray.filter((e: any) => e.filter != event.target.value);
      this.newArray = [];
      this.coachesArray = [];
      this.newArray.push(this.tempArray);
      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.coachesArray.push(obj);
          console.log(this.coachesArray);
        }
      }
    }
    const index = this.gameFilter.findIndex(r => {
      if (r.id === id) {
        return id;
      }
    });
    this.gameFilter[index].checked = event.target.checked;

    this.checkAll = this.allChecked();
  }
  allChecked() {
   
    return this.gameFilter.every(v => v.checked === true);
  }
}
