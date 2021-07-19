import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFootball, ITeams } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private _urlTeams: string = "http://drake.in:1337/teams";
 // private _urlTeams: string = "http://192.168.10.50:1337/teams";
 serverUri:string = "http://drake.in:1337";
 private _urlFilter : string = "http://drake.in:1337/Game-Filters";
  
  

  constructor(private _httpClient:HttpClient) { }

  getTeams(): Observable<ITeams[]> {
    return this._httpClient.get<ITeams[]>(this._urlTeams);
  }
  getTeamsx(id: string): Observable<ITeams> {
    var uri: string = `${this._urlTeams}?id=${ id }`;
    console.log(uri);
    return this._httpClient.get<ITeams>(uri);
  }
 
 

  postForm(data:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })

    };

    this._httpClient.post<any>(this._urlTeams, data, httpOptions).subscribe(

      (res)=>{
        console.log(res);
      },
    )
  }
  filterData(){
    return this._httpClient.get(this._urlFilter);
  }
  // ----------------------------------------------------------------

 
  updateTeam(id, rosterBody): Observable<ITeams> {
    const teamUrl = 'http://drake.in:1337/teams/' + id;
    return this._httpClient.put<ITeams>(teamUrl , rosterBody); // return an observable
  }
  deleteTeam(team:any){
    
    return this._httpClient.delete("http://drake.in:1337/teams/" +team.id)
  }
  viewTeam(id:any): Observable<ITeams> {
    const teamUrl = 'http://drake.in:1337/teams/' + id;
    return this._httpClient.get<ITeams>(teamUrl); // return an observable
  }
}


