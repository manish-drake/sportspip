import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AddplayerdialogComponent } from './addplayerdialog/addplayerdialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})
export class RosterComponent implements OnInit {

  apiURL: string = '';
  items: any = [];
  sortcoachOrder: string = 'LastName';
  loadingData: Boolean = false;
  displayedColumns: string[] = ["JerseyNumber", "MemberType", "FirstName", "LastName", "createdAt", "DeleteAction"];
  //dataSource: any;
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private apiService: ApiService, private router: Router, private _snackBar: MatSnackBar) { }

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
    this.apiService.getItems('rosters')
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
          console.log("Error; get rosters data: ", error);
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AddplayerdialogComponent, {
      width: '50%',
      //height: '90%',
      data: this.items.filter(elem => { return elem.MemberType === "Player" })
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

}
