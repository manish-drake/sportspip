import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {OverlayHandle} from 'src/app/overlay-handle';

/*
export interface ScheduleItem {
  eventType: string;
  opponent: string;
  eventDatetime: Date
  location: string
}
*/
@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {
  frmSubscribe = this.fb.group({
    eventType: 'John Doe',
    opponent: 'Team X',
    eventDatetime: new Date('2020-10-20'),
    location: 'Liverpool',
    id: ''
  });
  eventTypes: string[] = ['Season', 'Profession', 'Tournament'];
  constructor(private fb: FormBuilder, private ref: OverlayHandle) {
    if (ref.data !== null) {
      this.frmSubscribe = this.fb.group({
        eventType: ref.data.EventType,
        opponent: ref.data.Opponent,
        eventDatetime: ref.data.EventDate,
        location: ref.data.Location,
        id: ref.data.id
      });
    }
  }

  ngOnInit(): void {}
  submit() {
    this.ref.close(this.frmSubscribe.value);
  }

  cancel() {
    this.ref.close(null);
  }
}
