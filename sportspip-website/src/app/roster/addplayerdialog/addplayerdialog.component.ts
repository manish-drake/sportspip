import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-addplayerdialog',
  templateUrl: './addplayerdialog.component.html',
  styleUrls: ['./addplayerdialog.component.css']
})
export class AddplayerdialogComponent implements OnInit {

  players: any = [];
  selectedPlayers: string[] = [];

  constructor(public dialogRef: MatDialogRef<AddplayerdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], private apiService: ApiService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.FetchItems();
  }

  FetchItems(): void {
    this.apiService.getItems('players')
      .subscribe(
        (data) => {
          this.players = data;
          this.data.forEach(key => {
            this.selectedPlayers.push(key.Player.id.toString());
          });
        },
        (error) => {
          console.log("Error; get players data: ", error);
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
