import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {ICoaches, ILevel, IProgram} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CoachesService implements Resolve<any> {

  public coaches;
  public tempEvents;
  public events;
  public levels;

  
 
  public onCoachesChange: BehaviorSubject<any>;

   /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onCoachesChange = new BehaviorSubject({});
   }
  //  private _urlLevel: string = `api/coaches-levels`;

  private _urlLevel: string = "/assets/data/level.json";
  private _urlProgram : string = "/assets/data/program.json";
  private _urlCoaches : string = "http://115.246.85.186:1337/coaches";

   /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
      return new Promise((resolve, reject) => {
        Promise.all([ this.getCoaches()]).then(res => {
          resolve(res);
        }, reject);
      });
    }
    
  
    /**
   * Coaches Update
   *
   * @param coaches
   */
  coachesUpdate(coaches) {
    const coachesChecked = coaches.filter(coaches => {
      return coaches.checked === true;
    });

    let coachesRef = [];
    coachesChecked.map(res => {
      coachesRef.push(res.filter);
    });

    let filteredCoaches = this.tempEvents.filter(event => coachesRef.includes(event.coaches));
    this.events = filteredCoaches;
   // this.onEventChange.next(this.events);
  }

   /**
   * Get Coaches
   */
    getCoaches(): Promise<any[]> {
      const url = `api/coaches-filter`;
  
      return new Promise((resolve, reject) => {
        this._httpClient.get(url).subscribe((response: any) => {
          this.coaches = response;
          this.onCoachesChange.next(this.coaches);
          resolve(this.coaches);
        }, reject);
      });
    }
    // getLevel(): Promise<any[]> {
    //   const url = `api/coaches-levels`;
  
    //   return new Promise((resolve, reject) => {
    //     this._httpClient.get(url).subscribe((response: any) => {
    //       this.levels = response;
          
    //       this.onCoachesChange.next(this.levels);
    //       resolve(this.levels);
    //     },reject );
    //   });
    // }
    getLevel(): Observable<ILevel[]> {
      return this._httpClient.get<ILevel[]>(this._urlLevel);
    }
    getProgram(): Observable<IProgram[]> {
      return this._httpClient.get<IProgram[]>(this._urlProgram);
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