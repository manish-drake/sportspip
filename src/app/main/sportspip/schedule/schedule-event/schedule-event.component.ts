import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EventRef } from '../schedule.model';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleEventComponent implements OnInit {

  //  Decorator
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('endDatePicker') endDatePicker;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings;

  // Public
  public event: EventRef;
  public isDataEmpty;
  public selectLabel = [
    { label: 'Football', bullet: 'primary' },
    { label: 'Basketball', bullet: 'success' },
    { label: 'Tennis', bullet: 'danger' },
    { label: 'Golf', bullet: 'warning' },
    { label: 'Hockey', bullet: 'info' }
  ];
  public selectGuest = [
    { name: 'Jane Foster', avatar: 'assets/images/avatars/1-small.png' },
    { name: 'Donna Frank', avatar: 'assets/images/avatars/3-small.png' },
    { name: 'Gabrielle Robertson', avatar: 'assets/images/avatars/5-small.png' },
    { name: 'Lori Spears', avatar: 'assets/images/avatars/7-small.png' },
    { name: 'Sandy Vega', avatar: 'assets/images/avatars/9-small.png' },
    { name: 'Cheryl May', avatar: 'assets/images/avatars/11-small.png' }
  ];
  
  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };
  public endDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {ScheduleService} _scheduleService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _scheduleService: ScheduleService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Event Sidebar
   */
  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('schedule-event-sidebar').toggleOpen();
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    if (eventForm.valid) {
      //! Fix: Temp fix till ng2-flatpicker support ng-modal (Getting NG0100: Expression has changed after it was checked error if we use ng-model with ng2-flatpicker)
      eventForm.form.value.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
      eventForm.form.value.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;

      this._scheduleService.addEvent(eventForm.form.value);
      this.toggleEventSidebar();
    }
  }

  /**
   * Update Event
   */
  updateEvent() {
    this.toggleEventSidebar();
    //! Fix: Temp fix till ng2-flatpicker support ng-modal
    this.event.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    this.event.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
    this._scheduleService.postUpdatedEvent(this.event);
  }

  /**
   * Delete Event
   */
  deleteEvent() {
    this._scheduleService.deleteEvent(this.event);
    this.toggleEventSidebar();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to current event changes
    this._scheduleService.onCurrentEventChange.subscribe(response => {
      this.event = response;

      // If Event is available
      if (Object.keys(response).length > 0) {
        this.event = response;
        this.isDataEmpty = false;
        if (response.id === undefined) {
          this.isDataEmpty = true;
        }
      }
      // else Create New Event
      else {
        this.event = new EventRef();

        // Clear Flatpicker Values
        setTimeout(() => {
          this.startDatePicker.flatpickr.clear();
          this.endDatePicker.flatpickr.clear();
        });
        this.isDataEmpty = true;
      }
    });

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
}