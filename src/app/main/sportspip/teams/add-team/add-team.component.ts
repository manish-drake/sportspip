import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {


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
  addTeam(team:any){
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
