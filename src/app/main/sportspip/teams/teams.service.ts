import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFootball, ITeams } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  //private _urlTeams: string = "http://drake.in:1337/teams";
  private _urlTeams: string = "http://192.168.10.50:1337/teams";
  


  constructor(private _httpClient:HttpClient) { }

  getTeams(): Observable<ITeams[]> {
    return this._httpClient.get<ITeams[]>(this._urlTeams);
  }
  getTeamsx(id: string): Observable<ITeams> {
    var uri: string = `${this._urlTeams}?id=${ id }`;
    console.log(uri);
    return this._httpClient.get<ITeams>(uri);
  }
  updateTeams(user:any){
    return this._httpClient.put(this._urlTeams +user.id, user)
  }
  deleteTeams(user:any){
    return this._httpClient.delete(this._urlTeams +user.id)
  }
 
}
