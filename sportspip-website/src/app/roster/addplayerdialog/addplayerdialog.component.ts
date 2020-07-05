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
  addedPlayers: any[] = [];
  loadingData: boolean = false;
  //playersToDelete: string[] = [];

  constructor(public dialogRef: MatDialogRef<AddplayerdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], private apiService: ApiService) { }

  ngOnInit(): void {
    //console.log(this.data);
    this.FetchItems();
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('players')
      .subscribe(
        (data) => {
          this.players = data;
          this.data.forEach(key => {
            this.selectedPlayers.push(key.Player.id.toString());
            this.addedPlayers.push({ rosterId: key.id.toString(), playerId: key.Player.id.toString() });
          });
          console.log(this.addedPlayers);
          this.loadingData = false;
        },
        (error) => {
          console.log("Error; get players data: ", error);
        }
      );
  }

  onNoClick(): void {
   
    if (this.addedPlayers.length > 0) {
      this.addedPlayers.forEach(item => {
        if (this.selectedPlayers.indexOf(item.playerId) === -1) {
          this.DeleteItem(item.rosterId);
        }
      });
    }
    if (this.selectedPlayers.length > 0) {
      this.selectedPlayers.forEach(item => {
        let idx = this.addedPlayers.findIndex(roster => { return roster.playerId === item });
        if (idx === -1) {
          let player = this.players.filter(nplayer => { return nplayer.id === item });
          let newItem = {
            "MemberType": "Player",
            "Player": player.length > 0 ? player[0] : null,
            "FirstName": player.length > 0 ? player[0].FirstName : null,
            "LastName": player.length > 0 ? player[0].LastName : null
          };
          this.AddItem(newItem);
        }
      });
    }
    this.dialogRef.close();
  }

  AddItem(roster: any): void {
    console.log(roster);
    this.apiService.addItem('rosters', roster)
      .subscribe(
        (_data) => {
          console.log("success");
          
        },
        (error) => {
          console.log("Error; add roster data: ", error);
        }
      );
  }

  DeleteItem(id: any) {
    console.log(id);
    this.apiService.deleteItem('rosters', id)
      .subscribe(
        (_data) => { },
        (error) => {
          console.log("Error; delete roster data: ", error);
        }
      );
  }
}
