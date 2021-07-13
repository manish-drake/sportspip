import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoachesapiService } from './coachesapi.service';

@Component({
  selector: 'app-coachesfiltercoaches',
  templateUrl: './coachesfiltercoaches.component.html',
  styleUrls: ['./coachesfiltercoaches.component.scss']
})
export class CoachesfiltercoachesComponent implements OnInit {

  // serverUri:string = "http://drake.in:1337";
  serverUri: string = "http://192.168.10.50:1337";
  masterSelected:boolean;
  gameFilter: any = [];
  public checkAll = true;
  
  constructor(private _coachesApiService: CoachesapiService, private _coreSidebarService: CoreSidebarService) {

    this.masterSelected = false;
   }

 

  toggleCheckboxAll(){
    this.checkAll = true;
    for (var i = 0; i < this.coachesArray.length; i++) {
      this.coachesArray[i].checked = this.masterSelected;
    }
    this. getCheckedItemList()
  }

  getCheckedItemList(){
    this.coachesArray = [];
    for (var i = 0; i < this.coachesArray.length; i++) {
      if(this.coachesArray[i].checked)
      this.coachesArray.push(this.coachesArray[i]);
    }
    // this.coachesArray = JSON.stringify(this.coachesArray);
  }
  isAllSelected() {
    this.masterSelected = this.coachesArray.every(function(item:any) {
        return item.checked == true;
      })
    this.getCheckedItemList();
  }
  ngOnInit() {
    this.dataFilter();
    this.filterCoach();
  }
  dataFilter() {
    this._coachesApiService.filterData().subscribe((data: any[]) => {
      console.log(data);
      this.gameFilter = data;
      console.log(this.gameFilter);
    });
  }

  coachesArray: any = [];
  arrays: any = [];

  filterCoach() {
    this._coachesApiService.coachesData().subscribe((data: any[]) => {
      console.log(data);
      this.coachesArray = data;
      console.log(this.coachesArray)
    });

    this._coachesApiService.coachesData().subscribe((data: any[]) => {
      console.log(data);
      this.arrays = data;
      console.log(this.arrays)

    });
  }

  tempArray: any = [];
  newArray: any = [];

  onChange(event: any) {

    if (event.target.checked) {
      this.tempArray = this.arrays.filter((e: any) => e.id == event.target.value);
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
      this.tempArray = this.coachesArray.filter((e: any) => e.id != event.target.value);
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
  }
}
