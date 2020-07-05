import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-addcoachdialog',
  templateUrl: './addcoachdialog.component.html',
  styleUrls: ['./addcoachdialog.component.scss']
})
export class AddcoachdialogComponent implements OnInit {

  coaches: any = [];
  selectedcoaches: string[] = [];
  addedcoaches: any[] = [];
  loadingData: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddcoachdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[], private apiService: ApiService) { }


  ngOnInit(): void {
    this.FetchItems();
  }

  
  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('coaches')
      .subscribe(
        (data) => {
          this.coaches = data;
          this.data.forEach(key => {
            this.selectedcoaches.push(key.Coach.id.toString());
            this.addedcoaches.push({ rosterId: key.id.toString(), coachId: key.Coach.id.toString() });
          });
          console.log(this.addedcoaches);
          this.loadingData = false;
        },
        (error) => {
          console.log("Error; get coaches data: ", error);
        }
      );
  }

  onNoClick(): void {
   
    if (this.addedcoaches.length > 0) {
      this.addedcoaches.forEach(item => {
        if (this.selectedcoaches.indexOf(item.coachId) === -1) {
          this.DeleteItem(item.rosterId);
        }
      });
    }
    if (this.selectedcoaches.length > 0) {
      this.selectedcoaches.forEach(item => {
        let idx = this.addedcoaches.findIndex(roster => { return roster.coachId === item });
        if (idx === -1) {
          let coach = this.coaches.filter(ncoach => { return ncoach.id === item });
          let newItem = {
            "MemberType": "Coach",
            "Coach": coach.length > 0 ? coach[0] : null,
            "FirstName": coach.length > 0 ? coach[0].FirstName : null,
            "LastName": coach.length > 0 ? coach[0].LastName : null
          };
          this.AddItem(newItem);
        }
      });
    }
  }

  AddItem(roster: any): void {
    console.log(roster);
    this.apiService.addItem('rosters', roster)
      .subscribe(
        (_data) => {
          console.log("success");
          this.dialogRef.close();
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
