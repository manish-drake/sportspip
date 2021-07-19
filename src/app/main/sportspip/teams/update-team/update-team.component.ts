import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { IRoster, ITeams } from '../../interfaces';
import { TeamsService } from '../teams.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.scss']
})
export class UpdateTeamComponent implements OnInit {
  
  
  
  public avatarImage: string;

  constructor(private activatedRoute: ActivatedRoute, private _teamService:TeamsService) { }

  allTeam:any;
  isEdit=false;
  teamObj={
    teamName:'',
    role:'',
    school:'',
    country:'',
    status:'',
    sport:'',
    aboutTeam: ''
  }
  editTeam(team:any){
    this.isEdit = true;
    this.teamObj = team;
  }
  uploadImage(team: any) {
    if (team.target.files && team.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (team: any) => {
        this.avatarImage = team.target.result;
      };

      reader.readAsDataURL(team.target.files[0]);
    }
  }
  teamId = 0;

  rosterDetails: IRoster;
  teamUpdate(form) {
    const teamUpdate = {
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
    this._teamService.updateTeam(this.teamId, teamUpdate).subscribe(data => {
      console.log(data);
     // this.backToRoster();
    });
  }
  teamsID:string ="";
  teamsCollection:ITeams;
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.teamsID = this.activatedRoute.snapshot.queryParamMap.get('teamId');
      console.log('Url Id: ', this.teamsID);
      this._teamService.getTeamsx(this.teamsID).subscribe(
        data=> {
          this.teamsCollection = data[0] as ITeams;
          console.log(this.teamsCollection);
        }
      );
    });
  }
  
}
