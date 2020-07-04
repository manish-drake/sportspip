import { Component, OnInit } from '@angular/core';
import { OverlayHandle } from 'src/app/overlay-handle';
import { FormBuilder, Validators } from '@angular/forms';
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
    eventDatetime: '2020-10-20',
    location: 'Liverpool'
  });
  eventTypes: string[] = ['Season', 'Profession', 'Tournament'];
  constructor(private fb: FormBuilder, private ref: OverlayHandle) {
    this.frmSubscribe = this.fb.group({
      eventType: ref.data.EventType,
      opponent: ref.data.Opponent,
      eventDatetime: ref.data.EventDate,
      location: ref.data.Location
    });
  }

  ngOnInit(): void {
  }
  submit() {
    this.ref.close(this.frmSubscribe.value);
  }

  cancel() {
    this.ref.close(null);
  }
}
