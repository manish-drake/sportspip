import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoachesapiService } from '../coachesapi.service';

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.scss']
})
export class AddCoachComponent implements OnInit {

  public avatarImage: string;
  uploadForm: FormGroup;
  file: File;

  constructor(private fb: FormBuilder, private _coachService: CoachesapiService) { }

  onSubmit() {

    var data = {coachName:'', coachTitle:'', college:'', filter:'', aboutCoach:''};

    data.coachName = this.uploadForm.get('coachName').value;
    data.coachTitle = this.uploadForm.get('coachTitle').value;
    data.college = this.uploadForm.get('college').value;
    data.filter = this.uploadForm.get('filter').value;
    data.aboutCoach = this.uploadForm.get('aboutCoach').value;

    var formData = new FormData();
    formData.append('files.coachImage', this.file)
    formData.append('data', JSON.stringify(data));
    this._coachService.postForm(formData);
  }

  uploadImage(coach) {
    debugger
    if (coach.target.files && coach.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (coach:any) => {
        this.avatarImage = coach.target.result;
      };
      reader.readAsDataURL(coach.target.files[0]);
      if(coach.target.files.length>0){
        const file=coach.target.files[0];
        this.file=file;
        this.uploadForm.get('coachImage').setValue(file);
      }
    }
  
  }

  ngOnInit(): void {
    this.uploadForm= this.fb.group({
      coachName: [''],
      coachTitle: [''],
      college: [''],
      filter: [''],
      aboutCoach: [''],
      coachImage: ''
    })

  }

}
