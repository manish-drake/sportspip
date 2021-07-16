import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  uploadForm: FormGroup;
  file: File;

  public avatarImage: string;

  constructor(private fb: FormBuilder, private _teamsService: TeamsService){ }

 
  onSubmit() {

    var data = {teamName:'', role:'', schoolName:'', country:'', status:'', sport:''};

    data.teamName = this.uploadForm.get('teamName').value;
    data.role = this.uploadForm.get('role').value;
    data.schoolName = this.uploadForm.get('schoolName').value;
    data.country = this.uploadForm.get('country').value;
    data.status = this.uploadForm.get('status').value;
    data.sport = this.uploadForm.get('sport').value;

    var formData = new FormData();
    formData.append('data', JSON.stringify(data));
    this._teamsService.postForm(formData);
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

  ngOnInit(){
    this.uploadForm= this.fb.group({
      teamName: [''],
      role: [''],
      schoolName: [''],
      country: [''],
      status: [''],
      sport: ['']
    })
  }

}
