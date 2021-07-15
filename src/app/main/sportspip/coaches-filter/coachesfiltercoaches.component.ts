import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { filter } from 'rxjs/operators';
import { CoachesapiService } from './coachesapi.service';

@Component({
  selector: 'app-coachesfiltercoaches',
  templateUrl: './coachesfiltercoaches.component.html',
  styleUrls: ['./coachesfiltercoaches.component.scss']
})
export class CoachesfiltercoachesComponent implements OnInit {

  serverUri: string = "http://drake.in:1337";
  //serverUri: string = "http://192.168.10.50:1337";


  public checkAll = true;

  constructor(private _coachesApiService: CoachesapiService, private _coreSidebarService: CoreSidebarService) { }




  ngOnInit() {
    this.dataFilter();
    this.filterCoach();
  }

  //--------------------------subscribed data for for checkbox-----------------------------//

  gameFilter: any = [];

  dataFilter() {
    this._coachesApiService.filterData().subscribe((data: any[]) => {
      console.log(data);
      this.gameFilter = data;
      console.log(this.gameFilter);
    });
  }

  //----------------------subscribed coach data-----------------------------//
  coachesArray: any = [];
  arrays: any = [];

  filterCoach() {
    this._coachesApiService.coachesData().subscribe((data: any[]) => {
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
    ///toggle-----

    debugger

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
    debugger
    return this.gameFilter.every(v => v.checked === true);
  }
}
