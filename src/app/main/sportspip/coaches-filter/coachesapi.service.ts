import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICoaches } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CoachesapiService {
  private _urlCoaches : string = "http://drake.in:1337/coaches";
  private _urlFilter : string = "http://drake.in:1337/Game-Filters";

  constructor(private _httpClient: HttpClient) { }

  // getCoache(): Observable<ICoaches[]> {
  //   return this._httpClient.get<ICoaches[]>(this._urlCoaches);
  // }
   coachesData(){
    return this._httpClient.get(this._urlCoaches);
  }
   filterData(){
    return this._httpClient.get(this._urlFilter);
  }
}
