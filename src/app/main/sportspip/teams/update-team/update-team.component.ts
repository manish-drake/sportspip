import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { IRoster } from '../../interfaces';
import { TeamsService } from '../teams.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.scss']
})
export class UpdateTeamComponent implements OnInit {

  public avatarImage: string;
  constructor() { }

  allTeam:any;
  isEdit=false;
  teamObj={
    name:'',
    role:'',
    school:'',
    country:'',
    status:'',
    sport:'',
    about: ''
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
  ngOnInit(): void {
  }
}
