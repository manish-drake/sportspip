import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoster } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private _urlroster : string = "http://115.246.85.186:1337/rosters";

  constructor(private _httpClient:HttpClient) { }

  getRoster(): Observable<IRoster[]> {
    return this._httpClient.get<IRoster[]>(this._urlroster);
    
  }

}
