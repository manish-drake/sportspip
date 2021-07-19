import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { filter } from 'rxjs/operators';
import { ICoaches } from '../interfaces';
import { CoachesapiService } from './coachesapi.service';
@Component({
  selector: 'app-coachesfiltercoaches',
  templateUrl: './coachesfiltercoaches.component.html',
  styleUrls: ['./coachesfiltercoaches.component.scss']
})
export class CoachesfiltercoachesComponent implements OnInit {
  // serverUri: string = "http://drake.in:1337";
  serverUri: string = "http://drake.in:1337";
  coachID:string ="";
  public checkAll = true;
  coachCollection:ICoaches;
  constructor(private _coachesApiService: CoachesapiService, private _coreSidebarService: CoreSidebarService,
    private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.dataFilter();
    this.filterCoach();
    //this.filterCoachfrom();
    this.GetCoachData();

    // ---------------------------- filter --------------------------------------//
    this.sports() ;
    this.levels();
    
    this. programs();
    this.years();
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
  coachesArray:ICoaches[]
  arrays: ICoaches[];
  filterCoach() {
    this._coachesApiService.coachesData().subscribe((data: any[]) => {
      console.log(data);
      this.coachesArray = data;
      this.arrays = this.coachesArray;
      console.log(this.coachesArray)
    });
  }
   coachData:ICoaches[];
  // filterCoachfrom(){
  //   this._coachesApiService.coachesdatafrom().subscribe((data: any[]) => {
  //     console.log(data);
  //     this.coachData = data;
     
  //     console.log(this.coachData)
  //   });
  // }

  // coachFilterData:ICoaches[];
  // filterCoachfrom(){
  //   this._coachesApiService.coachesdatafrom().subscribe((data: any[]) => {
  //     console.log(data);
  //     this.coachData = data;
     
  //     console.log(this.coachData)
  //   });
  // }
  //--------------------------toggle checkbox logic--------------------------------//
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
      this.tempArray = this.coachesArray
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
  //   ///-----------------toggle checkbox------------//
    this.checkAll = event.target.checked;
    if (this.checkAll) {
      this.gameFilter.map(res => {
        res.checked = true;
      });
    } else {
      this.gameFilter.map(res => {
        res.checked = false;
        this.coachesArray = [];
      });
    }
  }
  // //---------------------logic for filter coach --------------------------//
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
  // //-----------------checkbox select all------------------------//
  allChecked() {
    return this.gameFilter.every(v => v.checked === true);
  }


//-----------------------------------coach data--------------------------
  coachtData: any = [];
  displayCoach: any = [];
  coachFilter: any = [];
 

  GetCoachData() {
    this._coachesApiService.coachData()
      .subscribe((
        data:any )=> {
          this.coachtData = data;
          // console.log(this.coachtData[0].levels);
          // this.displayCoach = this.coachtData.levels;
          console.log(this.coachtData)
        
        

        });
  }
//-----------------------------------/coach data--------------------------
  // -----------------------------------Data for sidebar filter-----------------------------

  level:any=[];
  levels() {
    this._coachesApiService.getLevel()
      .subscribe((
        data:any )=> {
          this.level = data;
          console.log(this.level);
        });
  }

  sport:any=[];
  sports() {
    this._coachesApiService.getSports()
      .subscribe((
        data:any )=> {
          this.sport = data;
          console.log(this.sport);
        });
  }
  program:any=[];
  programs() {
    this._coachesApiService.getProgram()
      .subscribe((
        data:any )=> {
          this.program = data;
          console.log(this.program);
        });
  }
  year:any=[];
  years() {
    this._coachesApiService.getYear()
      .subscribe((
        data:any )=> {
          this.year = data;
          console.log(this.year);
        });
  }
   // -----------------------------------/Data for sidebar filter-----------------------------

}