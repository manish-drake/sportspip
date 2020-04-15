import { Component, OnInit, Pipe, PipeTransform, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../service/api.service';

@Pipe({
  name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], value: any): any[] {
    if (!items) {
      return [];
    }
    if (!value) {
      return items;
    }
    let keys: any[] = ['Title','Sport','Skill'];
    return items.filter(item => {
      return keys.every(key => item.metadata[key].toLowerCase().indexOf(value) !== -1);
    });
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
  displayedColumns: string[] = ["Date", "Title", "Sport", "Skill", "Views", "Duration", "DeleteAction"];
  filterValue: any = '';


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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    // let dataSource: any = new MatTableDataSource().data.push(this.items);
    // dataSource.filter = filterValue.trim().toLowerCase();
    // this.items = dataSource.data;
  }

}
