import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GatewayService } from '../gateway.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _serverUri: string; 
  public get serverUri(): string {
    return this._serverUri;
  }
  constructor(private httpclient:HttpClient, private gatewayService: GatewayService) {

    this._serverUri = this.gatewayService.strapiUri("");
   }
   getcomments(): Observable<any>{
    return this.httpclient.get(this.gatewayService.strapiUri("/footballs"));     
  }
}
