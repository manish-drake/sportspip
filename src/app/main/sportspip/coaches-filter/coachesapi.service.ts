import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICoaches } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class CoachesapiService {
  private _urlCoaches : string = "http://drake.in:1337/coaches";
  private _urlFilter : string = "http://drake.in:1337/Game-Filters";
  // private _urlFilter : string ="http://192.168.10.50:1337/Game-Filters";
  // private _urlCoaches : string = "http://192.168.10.50:1337/coaches";
  private _urlcoachesdatafrom: string = "http://drake.in:1339/coaches";

  private _urllevel : string ="http://drake.in:1339/levels";
  private _urlSports : string = "http://drake.in:1339/sports";
 private _urlProgram: string ="http://drake.in:1339/programs";
 private _urlYears : string ="http://drake.in:1339/years";


  public tempEvents;
  public events;
  public coaches;
  public onCoachesChange: BehaviorSubject<any>;
  onEventChange: any;
  constructor(private _httpClient: HttpClient,
    ) {
      this.onCoachesChange = new BehaviorSubject({});
     }
     getCoachX(id: string): Observable<ICoaches> {
      var uri: string = `${this._urlCoaches}?id=${ id }`;
      console.log(uri);
      return this._httpClient.get<ICoaches>(uri);
    }
     coachesData(): Observable<ICoaches[]>{
      return this._httpClient.get<ICoaches[]>(this._urlCoaches);
    }
     filterData(){
      return this._httpClient.get(this._urlFilter);
    }


    postForm(data:any){
      const httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json'
        })
      };
      this._httpClient.post<any>(this._urlCoaches, data, httpOptions).subscribe(
        (res)=>{
          console.log(res);
        },
      )
    }

  

    coachData(){

      return this._httpClient.get(this._urlcoachesdatafrom);
    }
  
    // -------------------------------------------------------------------------------
    getLevel()
    {
      return this._httpClient.get(this._urllevel);
    }
    getSports(){
      return this._httpClient.get(this._urlSports);
    }
    getProgram(){
      return this._httpClient.get(this._urlProgram);
    }
    getYear(){
      return this._httpClient.get(this._urlYears);
    }
}