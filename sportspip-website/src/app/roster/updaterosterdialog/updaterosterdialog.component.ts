import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-updaterosterdialog',
  templateUrl: './updaterosterdialog.component.html',
  styleUrls: ['./updaterosterdialog.component.scss']
})
export class UpdaterosterdialogComponent implements OnInit {

  roster: any = {};

  constructor(public dialogRef: MatDialogRef<UpdaterosterdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], private apiService: ApiService) { }


  ngOnInit(): void {
    this.roster = this.data;
  }

  onNoClick(): void {
    this.apiService.updateItem('rosters', this.roster)
      .subscribe(
        (data) => {
          this.dialogRef.close();
        },
        (error) => {
          console.log("Error; update coach data: ", error);

        }
      );
  }

}
