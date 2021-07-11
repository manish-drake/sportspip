import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ILevel } from '../../interfaces';


import {ScheduleService} from '../schedule.service';

@Component({
  selector: 'app-schedule-filter',
  templateUrl: './schedule-filter.component.html',
  styleUrls: ['./schedule-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleFilterComponent implements OnInit {

   // Public
   public scheduleRef = [];
   public tempRef = [];
   public checkAll = true;
   levels:ILevel[];
 
   /**
    * Constructor
    *
    * @param {CoreSidebarService} _coreSidebarService
    * @param {CalendarService} _calendarService
    */
   constructor(private _coreSidebarService: CoreSidebarService, private _scheduleService: ScheduleService) {}
 
   // Public Methods
   // -----------------------------------------------------------------------------------------------------
 
  //  /**
  //   * Toggle Event Sidebar
  //   */
   toggleEventSidebar() {
     this._coreSidebarService.getSidebarRegistry('schedule-event-sidebar').toggleOpen();
   }
 
   /**
    * Add Event
    *
    */
   AddEvent() {
     this.toggleEventSidebar();
     this._scheduleService.createNewEvent();
   }
 
   /**
    * If all checkbox are checked : returns TRUE
    */
   allChecked() {
     return this.scheduleRef.every(v => v.checked === true);
   }
 
   /**
    * Checkbox Change
    *
    * @param event
    * @param id
    */
   checkboxChange(event, id) {
     const index = this.scheduleRef.findIndex(r => {
       if (r.id === id) {
         return id;
       }
     });
     this.scheduleRef[index].checked = event.target.checked;
     this._scheduleService.scheduleUpdate(this.scheduleRef);
     this.checkAll = this.allChecked();
   }
 
   /**
    * Toggle All Checkbox
    *
    * @param event
    */
   toggleCheckboxAll(event) {
     this.checkAll = event.target.checked;
     if (this.checkAll) {
       this.scheduleRef.map(res => {
         res.checked = true;
       });
     } else {
       this.scheduleRef.map(res => {
         res.checked = false;
       });
     }
     this._scheduleService.scheduleUpdate(this.scheduleRef);
   }

   
 
   // Lifecycle Hooks
   // -----------------------------------------------------------------------------------------------------
 
   /**
    * On init
    */
   ngOnInit(): void {

    this._scheduleService.getLevel().subscribe(data=> this.levels = data)
    console.log(this.levels);
     // Subscribe to Calendar changes
     this._scheduleService.onCalendarChange.subscribe(res => {
       this.scheduleRef = res;
     });
   }

 }
 
