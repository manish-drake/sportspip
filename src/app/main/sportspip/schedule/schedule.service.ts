import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

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
     }, reject);
   });
 }

 /**
  * Get Events
  */
 getEvents(): Promise<any[]> {
   const url = `api/schedule-events`;

   return new Promise((resolve, reject) => {
     this._httpClient.get(url).subscribe((response: any) => {
       this.events = response;
       this.tempEvents = response;
       this.onEventChange.next(this.events);
       resolve(this.events);
     }, reject);
   });
 }

 /**
  * Get Calendar
  */
 getSchedule(): Promise<any[]> {
   const url = `api/schedule-filter`;

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
     this._httpClient.delete('api/schedule-events/' + event.id).subscribe(response => {
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
   newEvent.url = eventForm.url;
   newEvent.title = eventForm.title;
   newEvent.start = eventForm.start;
   newEvent.end = eventForm.end;
   newEvent.allDay = eventForm.allDay;
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
   newEvent.allDay = eventRef.event.allDay;
   newEvent.id = parseInt(eventRef.event.id);
   newEvent.url = eventRef.event.url;
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
     this._httpClient.post('api/schedule-events/', this.currentEvent).subscribe(response => {
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
     this._httpClient.post('api/schedule-events/' + event.id, { ...event }).subscribe(response => {
       this.getEvents();
       resolve(response);
     }, reject);
   });
 }
}
