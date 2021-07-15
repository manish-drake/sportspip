import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRoster } from 'app/main/sportspip/interfaces';
import { RosterService } from '../roster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-roster',
  templateUrl: './update-roster.component.html',
  styleUrls: ['./update-roster.component.scss']
})
export class UpdateRosterComponent implements OnInit {

  rosterId = 0;

  rosterDetails: IRoster;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _rosterService: RosterService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this.rosterId = data.id;

      this._rosterService.viewRoster(this.rosterId).subscribe(data => {
        this.rosterDetails = data; // get the existing data of the product
        console.log(this.rosterDetails);
      });

    });
  }

  updateRoster(form) {
    const updateRoster = {
      id: form.value.id,
      sport: form.value.sport,
      level: form.value.level,
      // program: form.value.program,
      year: form.value.year,
      name: form.value.name,
      // playerNumber: form.value.playerNumber,
      school: form.value.school,
      address: form.value.address,
      rosterId: form.value.rosterId,
      playerLevel: form.value.playerLevel,
      isAvailable: 1,
    };
    console.log(form);
    this._rosterService.updateRoster(this.rosterId, updateRoster).subscribe(data => {
      console.log(data);
      this.backToRoster();
    });
  }
  backToRoster() {
    this.router.navigate(['/sportspip/roster']);
  }
}
