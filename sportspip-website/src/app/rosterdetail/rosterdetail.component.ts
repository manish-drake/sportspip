import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RosterdetailDataSource, RosterdetailItem } from './rosterdetail-datasource';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-rosterdetail',
  templateUrl: './rosterdetail.component.html',
  styleUrls: ['./rosterdetail.component.css']
})
export class RosterdetailComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<RosterdetailItem>;
  dataSource: RosterdetailDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['jerseyNumber', 'first', 'last', 'role', 'position', 'year'];
  constructor(private apiService: ApiService){

  }
  ngOnInit() {
    this.dataSource = new RosterdetailDataSource(this.apiService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
