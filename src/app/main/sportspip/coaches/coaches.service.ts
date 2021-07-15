import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {CFilter, ICoaches, ILevel, IProgram} from '../interfaces';

@Injectable({
  providedIn: 'root'
})

//implements Resolve<any>
export class CoachesService  {

  
  constructor(private _httpClient: HttpClient) { }
 

 
  private _urlCoaches : string = "http://192.168.10.50:1337/coaches";
 // private url = `http://192.168.10.50:1337/Game-Filters`;//`api/coaches-filter`;
  private _urlCFilter = `http://192.168.10.50:1337/Game-Filters`;

  coachesData(){
    return this._httpClient.get(this._urlCoaches);
  }
   filterData(){
    return this._httpClient.get(this._urlCFilter);
  }
 
    getCoache(): Observable<ICoaches[]> {
      return this._httpClient.get<ICoaches[]>(this._urlCoaches);
    }
    getCoachX(id: string): Observable<ICoaches> {
      var uri: string = `${this._urlCoaches}?id=${ id }`;
      console.log(uri);
      return this._httpClient.get<ICoaches>(uri);
    }
}