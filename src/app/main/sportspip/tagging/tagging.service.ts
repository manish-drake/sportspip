
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { Delivery } from '../interfaces';
import {HttpClient, HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { GatewayService } from '../gateway.service';

                                          

@Injectable({
  providedIn: 'root'
})
export class TaggingService {

  

  constructor(private http:HttpClient, private gatewayService: GatewayService) { }

  private _mediaUri: string = this.gatewayService.serverUri("/cricket.mp4");
  private _eventUri: string = this.gatewayService.strapiUri("/EVENTS");

  public get eventUri(): string {
    return this._eventUri;
  }
  public get mediaUri(): string {
    return this._mediaUri;
  }

  getDeliveriesBySession(session:string):Observable<Delivery[]> {
    const uri = this.gatewayService.strapiUri("/deliveries?Session=" + session);
    const encoded = encodeURI(uri)
    console.log(encoded);
    return this.http.get(encoded) as Observable<Delivery[]>
  }
  
  getPivot(deliveries:Delivery[]): Observable<any>{
    
    const uri = this.gatewayService.flaskUri("/postjson");
   //debugger
    return this.http.post<Delivery>(uri, deliveries)
    .pipe(
      catchError(this.handleError)
    );
  }
  getDeliveries(): Observable<Delivery>{
    return this.http.get(this.gatewayService.strapiUri("/deliveries")) as Observable<Delivery>;
  }
  addDelivery(delivery:Delivery): Observable<any>{
    return this.http.post<Delivery>(this.gatewayService.strapiUri("/deliveries"), delivery)
    .pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) :ObservableInput<any>{
    console.log(error);
    return throwError("Http Client threw error");
  }
}


