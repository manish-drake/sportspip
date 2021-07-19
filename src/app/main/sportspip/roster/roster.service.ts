import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoster } from 'app/main/sportspip/interfaces';



@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private _urlroster: string = "http://drake.in:1337/rosters";
  http: any;

  constructor(private _httpClient: HttpClient) { }

  getRoster(): Observable<IRoster[]> {
    return this._httpClient.get<IRoster[]>(this._urlroster);

  }
  // deleteRoster(roster:any){
  //   return this._httpClient.delete("http://192.168.10.50:1337/rosters" +roster.id, roster);
  // }
  // deleteRoster(rostertId): Observable<IRoster> {
  //   const rosterUrl = 'http://192.168.10.50:1337/rosters/' + rostertId;
  //   return this._httpClient.delete<IRoster>(rosterUrl); // return an observable
  // }
  updateRoster(id, rosterBody): Observable<IRoster> {
    const rosterUrl = 'http://drake.in:1337/rosters/' + id;
    return this._httpClient.put<IRoster>(rosterUrl, rosterBody); // return an observable
  }

  addRoster(rosterId, rosterBody): Observable<IRoster> {
    const rosterUrl = 'http://drake.in:1337/rosters/';
    return this._httpClient.post<IRoster>(rosterUrl, rosterBody); // return an observable
  }

  viewRoster(id:any): Observable<IRoster> {
    const rosterUrl = 'http://drake.in:1337/rosters/' + id;
    return this._httpClient.get<IRoster>(rosterUrl); // return an observable
  }

  delete(id: number) {
    console.log(id);
    return this.http.delete(`${this._urlroster}/${id}}, options`)

  }

}
