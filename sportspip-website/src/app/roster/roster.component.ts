import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AddplayerdialogComponent } from './addplayerdialog/addplayerdialog.component';
import { AddcoachdialogComponent } from './addcoachdialog/addcoachdialog.component';
import { UpdaterosterdialogComponent } from './updaterosterdialog/updaterosterdialog.component';
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
  displayedColumns: string[] = ["MemberType", "JerseyNumber", "FirstName", "LastName", "Positions", "DeleteAction"];
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

  FormatPositions(value) {
    //this.player.sports.map(e => e.Name).join(", ")     
    return value.map(e => e.Position).join();
  }

  openDialog(type: string): void {
    let rosterdata = [];
    let dialogtemplate;
    if (type === "player") {
      rosterdata = this.items.filter(elem => { return elem.MemberType === "Player" });
      dialogtemplate = AddplayerdialogComponent;
    }
    else if (type === "coach") {
      rosterdata = this.items.filter(elem => { return elem.MemberType === "Coach" })
      dialogtemplate = AddcoachdialogComponent;
    }


    const dialogRef = this.dialog.open(dialogtemplate, {
      width: '50%',
      //height: '90%',
      data: rosterdata
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource = new MatTableDataSource([]);
      this.FetchItems();
    });
  }

  updateDialog(elem: any): void {
    const dialogRef = this.dialog.open(UpdaterosterdialogComponent, {
      width: '500px',
      //height: '500px',
      data: elem
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource = new MatTableDataSource([]);
      this.FetchItems();
    });
  }

  DeleteItem(id: any) {
    //console.log(id);
    this.loadingData = true;
    this.apiService.deleteItem('rosters', id)
      .subscribe(
        (data) => {
          // console.log(data);
          this.openSnackBar('Item deleted successfully!', '');
          this.FetchItems();
          // this.items = data;
        },
        (error) => {
          this.openSnackBar('Error; delete Item!', '');
          console.log('Error; delete players data: ', error);
          this.loadingData = false;
        });
  }
}
