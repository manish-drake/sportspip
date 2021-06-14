import { Component, OnInit } from '@angular/core';
import { events } from '../interfaces';
import { EventService } from './event.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

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


