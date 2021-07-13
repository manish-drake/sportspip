import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICoaches } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CoachesapiService {
  // private _urlCoaches : string = "http://drake.in:1337/coaches";
  // private _urlFilter : string = "http://drake.in:1337/Game-Filters";

  private _urlFilter : string ="http://192.168.10.50:1337/Game-Filters";
  private _urlCoaches : string = "http://192.168.10.50:1337/coaches";

  public tempEvents;
  public events;
  public coaches;


  public onCoachesChange: BehaviorSubject<any>;
  onEventChange: any;

  constructor(private _httpClient: HttpClient,
    ) {
      this.onCoachesChange = new BehaviorSubject({});
     }

  
   coachesData(){
    return this._httpClient.get(this._urlCoaches);
  }
   filterData(){
    return this._httpClient.get(this._urlFilter);
  }
  coachUpdate(coaches) {
    const coachesChecked = coaches.filter(coach => {
      return coach.checked === true;
    });

    let coachesArray = [];
    coachesChecked.map(res => {
      coachesArray.push(res.filter);
    });

    let filteredCoach = this.tempEvents.filter(event => coachesArray.includes(event.coach));
    this.events = filteredCoach;
    this.onEventChange.next(this.events);
  }
  
}
