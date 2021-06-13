import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITeams } from '../interfaces';
import { TeamsService } from '../teams/teams.service';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {

serverUri:string = "http://115.246.85.186:1337";

teamsID:string ="";
teamsCollection:ITeams;
  constructor(private activatedRoute: ActivatedRoute, private _teamsService:TeamsService ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.teamsID = this.activatedRoute.snapshot.queryParamMap.get('teamId');
      console.log('Url Id: ', this.teamsID);
      this._teamsService.getTeamsx(this.teamsID).subscribe(
        data=> {
          this.teamsCollection = data[0] as ITeams;
          console.log(this.teamsCollection);
        }
      );
    });
  }

}
