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

  
}
