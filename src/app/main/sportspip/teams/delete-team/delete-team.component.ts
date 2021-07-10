import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RosterService } from '../../roster/roster.service';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.scss']
})
export class DeleteTeamComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private _roster: RosterService) { }

  teamId = 0;

  ngOnInit(): void {
  }

}
