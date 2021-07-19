import { Component, OnInit } from '@angular/core';
import { events } from '../interfaces';
import { EventService } from './event.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public contentHeader: object;

  serverUri: string;
  eventData: events[];
  constructor(private _eventService: EventService) {
    this.serverUri = this._eventService.serverUri;

  }
  ngOnInit(): void {
    this._eventService.getcomments().subscribe(data => {
      this.eventData = data;
      console.log(this.eventData)
    });


  }

}


