import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import {Subject,Subscription} from 'rxjs/Rx';

@Injectable()
export class Compareviewservice {

  constructor(){

  }
  
  private events = new Subject();
  
  subscribe (event): Subscription {
    return this.events.subscribe(event);
  }
  
  next (event) {
    this.events.next(event);
  }
}