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
    let keys: any[] = ['Title', 'Sport', 'Skill'];
    return items.filter(item => {
      let itemMatched = false;
      keys.forEach(key => {
        if (item.metadata[key].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          itemMatched = true;
        }
      });
      return itemMatched;
    });
  }
}

@Pipe({
  name: 'sort'
})
@Injectable()
export class SortPipe implements PipeTransform {

  constructor(private pipsComponent: PipsComponent) { }

  transform(items: any[], order = ''): any[] {
    if (!items || order === '' || !order) {
      return items;
    }
    if (items.length <= 1) {
      return items;
    }
    if (order === 'dt_up_asc') {
      return items.slice().sort();
    }
    else if (order === 'dt_up_des') {
      return items.slice().reverse(); 
    }
    else if (order === 'dt_cr_asc') {
      return items.slice().sort((a, b) => {
        return <any>this.pipsComponent.FormatDate(b.metadata.DateCreated) - <any>this.pipsComponent.FormatDate(a.metadata.DateCreated);
      });
    }
    else if (order === 'dt_cr_des') {
      return items.slice().sort((a, b) => {
        return <any>this.pipsComponent.FormatDate(b.metadata.DateCreated) - <any>this.pipsComponent.FormatDate(a.metadata.DateCreated);;
      }).reverse();
    }
    else {
      return items;
    }
  }
}

@Component({
  selector: 'app-pips',
  templateUrl: './pips.component.html',
  styleUrls: ['./pips.component.css']
})
export class PipsComponent implements OnInit {

  apiURL: string = '';
  items: any = [];
  loadingData: Boolean = false;
  displayedColumns: string[] = ["Date", "Title", "Sport", "Skill", "Views", "Duration", "DeleteAction"];
  filterValue: any = '';


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.FetchItems();
    this.apiURL = this.apiService.getApiUrl();
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
    console.log("Deleting item with id: " + id)

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
