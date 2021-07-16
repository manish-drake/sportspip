import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoster } from 'app/main/sportspip/interfaces';



@Injectable({
  providedIn: 'root'
})
export class RosterService {

  private _urlroster: string = "http://192.168.10.50:1337/rosters";
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
  updateRoster(rosterId, rosterBody): Observable<IRoster> {
    const rosterUrl = 'http://192.168.10.50:1337/rosters/' + rosterId;
    return this._httpClient.put<IRoster>(rosterUrl, rosterBody); // return an observable
  }

  addRoster(rosterId, rosterBody): Observable<IRoster> {
    const rosterUrl = 'http://192.168.10.50:1337/rosters/';
    return this._httpClient.post<IRoster>(rosterUrl, rosterBody); // return an observable
  }
  
  viewRoster(productId): Observable<IRoster> {
    const rosterUrl = 'http://192.168.10.50:1337/rosters/' + productId;
    return this._httpClient.get<IRoster>(rosterUrl); // return an observable
  }

  delete(id : number){
    console.log(id);
return this.http.delete(`${this._urlroster}/${id}}, options`)

}

}
