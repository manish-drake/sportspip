import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlayer } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private _urlplayer : string = "http://115.246.85.186:1337/players";
  constructor(private _httpClient:HttpClient) { }

  getPlayer(): Observable<IPlayer[]> {
    return this._httpClient.get<IPlayer[]>(this._urlplayer);
  }
}
