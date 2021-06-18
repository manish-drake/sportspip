import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
  rosters: any;
  
  constructor(private activatedRoute: ActivatedRoute,private _roster:RosterService) { }

 rosterId=0;

  ngOnInit(): void {

    this._roster.getRoster().subscribe(data=> this.roster = data);

    
    
  }
 
  

}
