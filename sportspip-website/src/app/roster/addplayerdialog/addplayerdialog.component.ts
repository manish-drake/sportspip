import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';

export interface RosterItem {
  id: string,
  MemberType: string,
  positions: any[],
  FirstName: string,
  LastName: string,
  Player: any,
  JerseyNumber: string,
  isSelected: boolean
}

@Component({
  selector: 'app-addplayerdialog',
  templateUrl: './addplayerdialog.component.html',
  styleUrls: ['./addplayerdialog.component.css']
})
export class AddplayerdialogComponent implements OnInit {

  players: any = [];
  loadingData: boolean = false;
  rosters: RosterItem[] = [];
  positions: any = [];

  constructor(public dialogRef: MatDialogRef<AddplayerdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], private apiService: ApiService) { }

  ngOnInit(): void {
    //console.log(this.data);
    this.FetchPositions();
    this.FetchItems();
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

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('players')
      .subscribe(
        (data) => {
          this.players = data;
          this.data.forEach(key => {
            if (key.Player !== null) {
              let sposition = [];
              if (key.positions.length > 0) {
                sposition = key.positions.map(e => e.id);
              }
              this.rosters.push({
                id: key.id,
                MemberType: key.MemberType,
                positions: sposition,
                FirstName: key.FirstName,
                LastName: key.LastName,
                Player: key.Player,
                JerseyNumber: key.JerseyNumber,
                isSelected: true
              });
            }
          });
          // console.log("rosters");
          // console.log(this.rosters);
          this.players.forEach(player => {
            let idx = this.rosters.findIndex(r => { return player.id === r.Player.id });
            if (idx === -1) {
              this.rosters.push({
                id: "",
                MemberType: "Player",
                positions: [],
                FirstName: player.FirstName,
                LastName: player.LastName,
                Player: player,
                JerseyNumber: "",
                isSelected: false
              });
            }
          });
          this.loadingData = false;
        },
        (error) => {
          console.log("Error; get players data: ", error);
        }
      );
  }
  onNoClick(): void { this.dialogRef.close(); }

  onSaveClick(): void {
    console.log(this.rosters);
    if (this.rosters.length > 0) {
      this.rosters.forEach(item => {
        if (item.id !== "" && !item.isSelected) {
          this.DeleteItem(item.id);
        }
        else if (item.id === "" && item.isSelected) {
          delete item.id; delete item.isSelected;
          this.AddItem(item);
        }
        else if (item.id !== "" && item.isSelected) {
          this.UpdateItem(item);
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

  UpdateItem(roster: any): void {
    //this.roster.positions = this.selectedpositions;
    this.apiService.updateItem('rosters', roster)
      .subscribe(
        (data) => {
          //console.log("success");
        },
        (error) => {
          console.log("Error; update roster data: ", error);
        }
      );
  }

  DeleteItem(id: any) {
    console.log(id);
    this.apiService.deleteItem('rosters', id)
      .subscribe(
        (_data) => {
          //console.log("success");
        },
        (error) => {
          console.log("Error; delete roster data: ", error);
        }
      );
  }
}
