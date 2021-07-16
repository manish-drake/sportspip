import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {

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
