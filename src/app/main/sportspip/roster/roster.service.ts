import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoster } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private _urlroster : string = "http://drake.in:1337/rosters";

  constructor(private _httpClient:HttpClient) { }

  getRoster(): Observable<IRoster[]> {
    return this._httpClient.get<IRoster[]>(this._urlroster);
    
  }
 
  deleteRoster(rostertId): Observable<IRoster>{
    const rosterUrl = 'http://drake.in:1337/rosters/' + rostertId;
    return this._httpClient.delete<IRoster>(rosterUrl); // return an observable
  }
  updateRoster(rosterId, rosterBody): Observable<IRoster>{
    const rosterUrl = 'http://drake.in:1337/rosters/' + rosterId;
    return this._httpClient.put<IRoster>(rosterUrl, rosterBody); // return an observable
  }
  viewRoster(productId): Observable<IRoster>{
    const rosterUrl = 'http://drake.in:1337/rosters/'+ productId; 
    return this._httpClient.get<IRoster>(rosterUrl); // return an observable
  }

}
