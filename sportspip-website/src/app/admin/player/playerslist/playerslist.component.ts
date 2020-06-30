import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.css']
})
export class PlayerslistComponent implements OnInit {

  apiURL: string = '';
  items: any = [];
  selectedProgram: any = '';
  selectedYear: any = '';
  selectedGame: any = '';
  selectedLevel: any = '';
  sortcoachOrder: string = 'LastName';
  loadingData: Boolean = false;
  displayedColumns: string[] = ["FirstName", "LastName", "Height", "Hometown", "createdAt", "DeleteAction"];
  //dataSource: any;
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private apiService: ApiService, private router: Router, private _snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.FetchItems();
    this.apiURL = this.apiService.getApiUrl();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('players')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
          this.dataSource.data = this.items;
          this.dataSource.paginator = this.paginator;
          //console.log(this.sort);
          this.dataSource.sort = this.sort;
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
    this.apiService.deleteItem('players', id)
      .subscribe(
        (data) => {
          //console.log(data);
          this.openSnackBar("Item deleted successfully!", "");
          this.FetchItems();
          //this.items = data;
        },
        (error) => {
          this.openSnackBar("Error; delete Item!", "");
          console.log("Error; delete players data: ", error);
          this.loadingData = false;
        }
      );
  }

  EditItem(id: any) {
    //console.log("id:  " + id);
    this.router.navigate(['/admin/player', id]);
  }

  AddItem() {
    //console.log("id:  " + id);
    this.router.navigate(['/admin/player/add']);
  }
}
