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

  teamsCollection:ITeams[];
  allTeam:any;
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
  teamId="0"
  ngOnInit(): void {
    this._teamsService.getTeams().subscribe(data=> this.teamsCollection =data);


    
    this.activatedRoute.params.subscribe(data => {
      this.teamId = data.id; // Capture the ID which i want delete product
      console.log(this.teamId);
      
    });
    


    

    
  }
 
}

