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
  positions: any = [];
  selectedpositions: any = [];

  constructor(public dialogRef: MatDialogRef<UpdaterosterdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], private apiService: ApiService) { }


  ngOnInit(): void {
    this.roster = this.data;
    this.FetchPositions();
    if (this.roster.positions !== undefined && this.roster.positions.length > 0) {
      this.selectedpositions = this.roster.positions.map(e => e.id);
    }
  }

  FetchPositions(): void {
    this.apiService.getItems("positions")
      .subscribe(
        (data) => {
          this.positions = data;
        },
        (error) => {
          console.log("Error; get sports data: ", error);
        }
      );
  }
  onNoClick(): void {
    this.roster.positions = this.selectedpositions;
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
