import { Component, OnInit, Pipe, PipeTransform, Injectable } from '@angular/core';
 
import { ApiService } from '../service/api.service';

@Pipe({
  name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any {
      if (!items) {
          return [];
      }
      if (!field || !value) {
          return items;
      }
      return items.filter(singleItem => singleItem[field].includes(value));
  }
}

@Component({
  selector: 'app-pips',
  templateUrl: './pips.component.html',
  styleUrls: ['./pips.component.css']
})
export class PipsComponent implements OnInit {


  items: any = [];
  loadingData: Boolean = false;
  displayedColumns: string[] = ["Date","Title", "Sport", "Skill", "Views", "Duration", "DeleteAction"];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.FetchItems();
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('pips')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
        },
        (error) => {
          console.log("Error; get pips data: ", error);
          this.loadingData = false;
        }
      );
  }

  DeleteItem(id: number) {
    console.log(":: Deleting item with id: " + id)

    this.apiService.deleteItem('pips', id)
      .subscribe((res) => {
        console.log("Delete Response:" + res.toString());
        this.FetchItems();
      })
  }

  FormatDate(value) {
    var st = value;
        let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        let date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
        return date;
}

}
