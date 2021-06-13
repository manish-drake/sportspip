import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CoachDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
