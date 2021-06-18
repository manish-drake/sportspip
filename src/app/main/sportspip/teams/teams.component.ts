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

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  serverUri:string = "http://drake.in:1337";

  teamsCollection:ITeams[];
  constructor(
    private _coreSidebarService: CoreSidebarService,
    
    private _coreConfigService: CoreConfigService,
    private _teamsService:TeamsService
  ) {}
  ngOnInit(): void {
    this._teamsService.getTeams().subscribe(data=> this.teamsCollection =data)
  }
}

