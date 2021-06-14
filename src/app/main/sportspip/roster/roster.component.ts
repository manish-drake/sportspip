import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IRoster } from '../interfaces';
import { RosterService } from './roster.service';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RosterComponent implements OnInit {

  roster:IRoster[];
  constructor(private _roster:RosterService) { }

  ngOnInit(): void {

    this._roster.getRoster().subscribe(data=> this.roster = data);
    
  }

}
