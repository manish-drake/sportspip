import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';

import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { EventRef } from 'app/main/apps/calendar/calendar.model';
import { TeamsService } from './teams.service';
import { IFootball, ITeams } from '../interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { id } from '@swimlane/ngx-datatable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  serverUri:string = "http://drake.in:1337";
  // 192.168.10.50:1337

 // serverUri:string = "http://192.168.10.50:1337";

 public checkAll = true;
  teamsCollection:ITeams[];
  allTeam:any;
  public contentHeader: object;

  isEdit=false;
  teamObj={
    name:'',
    role:'',
    school:'',
    country:'',
    status:'',
    sport:'',
    about: '',
    id:''
  }

  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _httpClient: HttpClient,
    private _coreConfigService: CoreConfigService,
    private _teamsService:TeamsService,
    private activatedRoute: ActivatedRoute
  ) {}

  deleteUser(team:any){
    this._teamsService.deleteTeam(team).subscribe(()=>{
      
    })
  }

    //--------------------------subscribed data for for checkbox-----------------------------//

    gameFilter: any = [];

    teamId=0; 
    dataFilter() {
      this._teamsService.filterData().subscribe((data: any[]) => {
        console.log(data);
        this.gameFilter = data;
        console.log(this.gameFilter);
      });
    }
  
  ngOnInit(): void {
    //this._teamsService.getTeams().subscribe(data=> this.teamsCollection =data);

    // content header
    this.contentHeader = {
      headerTitle: 'Teams',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          // {
          //   name: '',
          //   isLink: true,
          //   link: '/'
          // },
          {
            name: 'Teams',
            isLink: false
          }
        ]
      }
    };
    this.dataFilter();
    this.filterplayer();
    
    this.activatedRoute.params.subscribe(data => {
      this.teamId = data.id; // Capture the ID which i want delete product
      console.log(this.teamId);
      
    });
    


    

    
  }




        //----------------------subscribed coach data-----------------------------//
        teamArray:ITeams[]
        arrays: ITeams[];
      
        filterplayer() {
          this._teamsService.getTeams().subscribe((data: any[]) => {
            console.log(data);
            this.teamArray= data;
            this.arrays = this.teamArray;
            console.log(this.teamArray)
          });
        }

   //--------------------------toggle checkbox logic--------------------------------//
   toggleCheckboxAll(event) {

    if (event.target.checked) {

      this.tempArray = this.arrays;

      this.teamArray= [];

      this.newArray.push(this.tempArray);

      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.teamArray.push(obj);
          console.log(this.teamArray)
        }
      }
    }
    else {
      this.teamArray= [];
      this.tempArray = this.teamArray

      this.newArray = [];
      this.teamArray= [];
      this.newArray.push(this.tempArray);
      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.teamArray.push(obj);
          console.log(this.teamArray);
        }
      }
    }


    ///-----------------toggle checkbox------------//

    this.checkAll = event.target.checked;

    if (this.checkAll) {
      this.gameFilter.map(res => {
        res.checked = true;
      });
    } else {
      this.gameFilter.map(res => {
        res.checked = false;
        this.teamArray= [];

      });
    }

  }


  //---------------------logic for filter coach --------------------------//
  tempArray: any = [];
  newArray: any = [];

  onChange(event: any, id) {

    if (event.target.checked) {
      this.tempArray = this.arrays.filter((e: any) => e.filter == event.target.value);
      this.teamArray= [];

      this.newArray.push(this.tempArray);

      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.teamArray.push(obj);
          console.log(this.teamArray)
        }
      }
    }

    else {

      this.tempArray = this.teamArray.filter((e: any) => e.filter != event.target.value);
      this.newArray = [];
      this.teamArray= [];
      this.newArray.push(this.tempArray);
      for (let i = 0; i < this.newArray.length; i++) {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for (let i = 0; i < firstArray.length; i++) {
          var obj = firstArray[i];
          this.teamArray.push(obj);
          console.log(this.teamArray);
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

  //-----------------checkbox select all------------------------//
  allChecked() {
    return this.gameFilter.every(v => v.checked === true);

  }
 
}

