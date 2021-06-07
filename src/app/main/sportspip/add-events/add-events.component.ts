
import {HttpClient} from '@angular/common/http';

import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';

// import { CalendarService } from 'app/main/apps/calendar/calendar.service';
// import { EventRef } from 'app/main/apps/calendar/calendar.model';





@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddEventsComponent implements OnInit {


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
