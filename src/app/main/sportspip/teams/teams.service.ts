import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFootball } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private _urlFootball: string = "http://115.246.85.186:1337/footballs";


  constructor(private _httpClient:HttpClient) { }

  getFootballs(): Observable<IFootball[]> {
    return this._httpClient.get<IFootball[]>(this._urlFootball);
  }
}
