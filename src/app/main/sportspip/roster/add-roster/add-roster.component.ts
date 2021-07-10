import { LocationStrategy } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRoster } from '../../interfaces';
import { RosterService } from '../roster.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-roster',
  templateUrl: './add-roster.component.html',
  styleUrls: ['./add-roster.component.scss']
}) 

export class AddRosterComponent {

  rosterId = 0;

  rosterDetails: IRoster;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private _rosterService: RosterService,
    private _http: HttpClient,
    private router: Router) { }

    addRoster(data)
    {
      this._http.post<IRoster>('http://drake.in:1337/rosters',data)
      .subscribe((result)=>{
        console.log("result",result)
  
      })
      console.warn(data);
    }
    onSubmit(data: any)
    {
      this._http.post('http://drake.in:1337/Rosterdata',data)
      .subscribe((result)=>{
        console.log("result",result)
  
      });
      console.warn(data);
    }
   


  ngOnInit(): void {
    
  }

  backToRoster() {
    this.router.navigate(['/sportspip/roster']);
  }

  }

