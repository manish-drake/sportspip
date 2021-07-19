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

  constructor(private _teamsService:TeamsService,private activatedRoute: ActivatedRoute,private router: Router) { }
  id: string= '';

  teamDetails: ITeams;
  teamsID:string ="";
  teamsCollection:ITeams;

  
 
  uploadImage(team: any) {
    if (team.target.files && team.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (team: any) => {
        this.avatarImage = team.target.result;
      };

      reader.readAsDataURL(team.target.files[0]);
    }
  }

  // updateTeam(){
  //   this.isEdit = !this.isEdit;
  //   this._teamsService.updateTeam(this.teamObj).subscribe(()=>{
      
  //   })
 // }
 

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this.id = data.id;

      this._teamsService.viewTeam(this.id).subscribe(data => {
        this.teamDetails = data; // get the existing data of the product
        console.log(this.teamDetails);
      });

    });
    
  }
  updateTeam(form) {
    const updateTeam = {
      id: form.value.id,
      name: form.value.name,
      role: form.value.role,
      // program: form.value.program,
      school: form.value.school,
      country: form.value.country,
      // playerNumber: form.value.playerNumber,
      status: form.value.status,
      sport: form.value.sport,
      about: form.value.about,
      //playerLevel: form.value.playerLevel,
      isAvailable: 1,
    };
    console.log(form);
    this._teamsService.updateTeam(this.id, updateTeam).subscribe(data => {
      console.log(data);
      this.backToTeam();
    });
  }
  backToTeam() {
    this.router.navigate(['/sportspip/team']);
  }
}
