import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoreConfigService } from '@core/services/config.service';

import { ScheduleService } from 'app/main/sportspip/schedule/schedule.service';
import { EventRef } from 'app/main/sportspip/schedule/schedule.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  // Public
  public slideoutShow = false;
  public events = [];
  public event;

  public calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.events,
    weekends: true,
    editable: true,
    eventResizableFromStart: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClick: this.handleUpdateEventClick.bind(this),
    eventClassNames: this.eventClass.bind(this),
    select: this.handleDateSelect.bind(this)
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {ScheduleService} _scheduleService
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _scheduleService: ScheduleService,
    private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Event Class
   *
   * @param s
   */
  eventClass(s) {
    const schedulesColor = {
      Football: 'primary',
      Basketball: 'success',
      Tennis: 'danger',
      Golf: 'warning',
      Hockey: 'info'
    };

    const colorName = schedulesColor[s.event._def.extendedProps.schedule];
    return `bg-light-${colorName}`;
  }

  /**
   * Update Event
   *
   * @param eventRef
   */
  handleUpdateEventClick(eventRef: EventClickArg) {
    this._coreSidebarService.getSidebarRegistry('schedule-event-sidebar').toggleOpen();
    this._scheduleService.updateCurrentEvent(eventRef);
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Date select Event
   *
   * @param eventRef
   */
  handleDateSelect(eventRef) {
    const newEvent = new EventRef();
    newEvent.start = eventRef.start;
    this._coreSidebarService.getSidebarRegistry('schedule-event-sidebar').toggleOpen();
    this._scheduleService.onCurrentEventChange.next(newEvent);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      // ! If we have zoomIn route Transition then load calendar after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          // Subscribe to Event Change
          this._scheduleService.onEventChange.subscribe(res => {
            this.events = res;
            this.calendarOptions.events = res;
          });
        }, 450);
      } else {
        // Subscribe to Event Change
        this._scheduleService.onEventChange.subscribe(res => {
          this.events = res;
          this.calendarOptions.events = res;
        });
      }
    });

    this._scheduleService.onCurrentEventChange.subscribe(res => {
      this.event = res;
    });
  }

  /**
   * Calendar's custom button on click toggle sidebar
   */
  ngAfterViewInit() {
    // Store this to _this as we need it on click event to call toggleSidebar
    let _this = this;
    this.calendarOptions.customButtons = {
      sidebarToggle: {
        text: '',
        click() {
          _this.toggleSidebar('schedule-main-sidebar');
        }
      }
    };
  }
}
