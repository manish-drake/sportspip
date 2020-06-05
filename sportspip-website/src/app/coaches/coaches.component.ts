import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.css']
})
export class CoachesComponent implements OnInit {

  apiURL: string = '';
  items: any = [];
  loadingData: Boolean = false;

  constructor(private apiService : ApiService) { }

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
}
