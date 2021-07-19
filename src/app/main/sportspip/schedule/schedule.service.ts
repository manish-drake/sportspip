import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { ILevel, IProgram } from '../interfaces';

import { EventRef } from '../schedule/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService implements Resolve<any>  {

  // Public
  public events;
  public schedule;
  public currentEvent;
  public tempEvents;

  public onEventChange: BehaviorSubject<any>;
  public onCurrentEventChange: BehaviorSubject<any>;
  public onCalendarChange: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onEventChange = new BehaviorSubject({});
    this.onCurrentEventChange = new BehaviorSubject({});
    this.onCalendarChange = new BehaviorSubject({});
  }
  private _urlLevel: string = "/assets/data/level.json";
  private _urlProgram: string = "/assets/data/program.json";

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getEvents(), this.getSchedule()]).then(res => {
        resolve(res);
        console.log("rake" + this.tempEvents)
      }, reject);
    });
  }

  /**
   * Get Events
   */
  getEvents(): Promise<any[]> {
    const url = `http://drake.in:1337/Schedules`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        this.events = response;
        this.tempEvents = response;
        this.onEventChange.next(this.events);
        console.log("ra" + this.events)
        resolve(this.events);
      }, reject);
    });
  }

  /**
   * Get Calendar
   */
  getSchedule(): Promise<any[]> {
    const url = `http://drake.in:1337/Game-Filters`;//`api/schedule-filter`; //`http://drake.in:1337/Event-Filters`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        this.schedule = response;
        this.onCalendarChange.next(this.schedule);
        resolve(this.schedule);
      }, reject);
    });
  }

  /**
   * Create New Event
   */
  createNewEvent() {
    this.currentEvent = {};
    this.onCurrentEventChange.next(this.currentEvent);
  }

  /**
   * Calendar Update
   *
   * @param schedules
   */
  scheduleUpdate(schedules) {
    const schedulesChecked = schedules.filter(schedule => {
      return schedule.checked === true;
    });

    let scheduleRef = [];
    schedulesChecked.map(res => {
      scheduleRef.push(res.filter);
    });

    let filteredSchedule = this.tempEvents.filter(event => scheduleRef.includes(event.schedule));
    this.events = filteredSchedule;
    this.onEventChange.next(this.events);
  }

  /**
   * Delete Event
   *
   * @param event
   */
  deleteEvent(event) {
    return new Promise((resolve, reject) => {
      this._httpClient.delete('http://drake.in:1337/Schedules' + event.id).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    const newEvent = new EventRef();
    newEvent.title = eventForm.title;
    newEvent.start = eventForm.start;
    newEvent.end = eventForm.end;
    newEvent.home = eventForm.home;
    newEvent.schedule = eventForm.selectlabel;
    newEvent.extendedProps.location = eventForm.location;
    newEvent.extendedProps.description = eventForm.description;
    newEvent.extendedProps.addGuest = eventForm.addGuest;
    this.currentEvent = newEvent;
    this.onCurrentEventChange.next(this.currentEvent);
    this.postNewEvent();
  }

  /**
   * Update Event
   *
   * @param eventRef
   */
  updateCurrentEvent(eventRef) {
    const newEvent = new EventRef();
    newEvent.home = eventRef.event.home;
    newEvent.id = parseInt(eventRef.event.id);
    newEvent.title = eventRef.event.title;
    newEvent.start = eventRef.event.start;
    newEvent.end = eventRef.event.end;
    newEvent.schedule = eventRef.event.extendedProps.schedule;
    newEvent.extendedProps.location = eventRef.event.extendedProps.location;
    newEvent.extendedProps.description = eventRef.event.extendedProps.description;
    newEvent.extendedProps.addGuest = eventRef.event.extendedProps.addGuest;
    this.currentEvent = newEvent;
    this.onCurrentEventChange.next(this.currentEvent);
  }

  /**
   * Post New Event
   */
  postNewEvent() {
    return new Promise((resolve, reject) => {
      this._httpClient.post('http://drake.in:1337/Schedules', this.currentEvent).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }

  /**
   * Post Updated Event
   *
   * @param event
   */
  postUpdatedEvent(event) {
    return new Promise((resolve, reject) => {
      this._httpClient.post('http://drake.in:1337/Schedules' + event.id, { ...event }).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }

  getLevel(): Observable<ILevel[]> {
    return this._httpClient.get<ILevel[]>(this._urlLevel);
  }
  getProgram(): Observable<IProgram[]> {
    return this._httpClient.get<IProgram[]>(this._urlProgram);
  }
}
