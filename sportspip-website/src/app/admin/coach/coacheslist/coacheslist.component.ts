import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coacheslist',
  templateUrl: './coacheslist.component.html',
  styleUrls: ['./coacheslist.component.css']
})
export class CoacheslistComponent implements OnInit {

  apiURL: string = '';
  items: any = [];
  selectedProgram: any = '';
  selectedYear: any = '';
  selectedGame: any = '';
  selectedLevel: any = '';
  sortcoachOrder: string = 'LastName';
  loadingData: Boolean = false;
  displayedColumns: string[] = ["FirstName", "LastName", "Title", "Date", "DeleteAction"];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.FetchItems();
    this.apiURL = this.apiService.getApiUrl();
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('coaches')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
        },
        (error) => {
          console.log("Error; get coaches data: ", error);
          this.loadingData = false;
        }
      );
  }

  FormatDate(value) {
    var st = value;
    let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    let date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
    return date;
  }


  DeleteItem(id: any) {
    console.log(id);
    this.loadingData = true;
    this.apiService.deleteItem('coaches', id)
      .subscribe(
        (data) => {
          this.loadingData = false;
          console.log(data);
          let itemIndex = this.items.findIndex(x => x == data);
          console.log(itemIndex);
          if (itemIndex >= 0) {
            this.items.pop(itemIndex);
          }
          //this.FetchItems();
          //this.items = data;
        },
        (error) => {
          console.log("Error; get coaches data: ", error);
          this.loadingData = false;
        }
      );
  }

  EditItem(id: any) {
    //console.log("id:  " + id);
    this.router.navigate(['/admin/coach', id]);
  }

  updateSportsFilter(emittedValue) {
    this.selectedGame = emittedValue;
  }

  updateLevelsFilter(emittedValue) {
    this.selectedLevel = emittedValue;
  }

  updateProgramsFilter(emittedValue) {
    this.selectedProgram = emittedValue;
  }

  updateYearsFilter(emittedValue) {
    this.selectedYear = emittedValue;
  }

}
