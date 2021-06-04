import {ComponentType} from '@angular/cdk/portal';
import {AfterViewInit, Component, OnInit, TemplateRef, Type, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';

import {OverlayService} from '../overlay.service';
import {ScheduleFormComponent} from '../schedule-form/schedule-form.component';
import {ApiService} from '../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ScheduleItem {
  EventType: string;
  Opponent: string;
  EventDate: Date
  Location: string
  id: string
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ScheduleItem>;
  dataSource: MatTableDataSource<ScheduleItem>;
  crudComponent: Type<any> = ScheduleFormComponent

  constructor(
      private overlayService: OverlayService, private apiService: ApiService, private _snackBar: MatSnackBar) {}
      openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
  /**
   * Columns displayed in the table. Columns IDs can be added, removed, or
   * reordered.
   */
  displayedColumns =
      ['EventType', 'Opponent', 'EventDate', 'Location', 'DeleteAction'];
  isOpen = false;
  loadingData: Boolean = false;
  ngOnInit() {
    this.dataSource = new MatTableDataSource<ScheduleItem>([]);

    this.apiService.getItems('events').subscribe(item => {
      let newData: ScheduleItem[] = [];
      (item as any[]).forEach(row => {
        newData.push({
          'EventType': row.EventType,
          'Opponent': row.Opponent,
          'EventDate': new Date(row.EventDate),
          'Location': row.Location,
          'id': row.id
        });
      });
      this.dataSource.data = newData;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  open(content: TemplateRef<any>|ComponentType<any>|string, data: any = {}) {
    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {
      let formData = res.data;
      // console.log(formData);
      if (data === null) {
        this.apiService.addItem('events', JSON.stringify({
          EventType: formData.eventType,
          Opponent: formData.opponent,
          EventDate: formData.eventDatetime,
          Location: formData.location
        }))
            .subscribe(
                result => {
                  let resp = result;
                  let dataSlice = this.dataSource.data.slice();
                  dataSlice.push(resp as any);
                  this.dataSource.data = dataSlice;
                },
                (error) => {
                  console.log('Error; update events data: ', error);
                });
      } else {
        this.apiService.updateItem('events', data)
            .subscribe(
                result => {
                  let resp = result;
                  data.EventType = formData.eventType;
                  data.Opponent = formData.opponent;
                  data.EventDate = formData.eventDatetime;
                  data.Location = formData.location;
                },
                (error) => {
                  console.log('Error; update events data: ', error);
                });
      }
    });
  }
  delete(id: any) {
    console.log(id);
    this.loadingData = true;
    this.apiService.deleteItem('events', id)
        .subscribe(
            (data) => {
              // console.log(data);
              this.openSnackBar('Item deleted successfully!', '');
              let dataSlice = this.dataSource.data.slice();
              let idx = dataSlice.findIndex(item=>item.id === id);
              dataSlice.splice(idx, 1);
              this.dataSource.data = dataSlice;
              this.loadingData = false;
            },
            (error) => {
              this.openSnackBar('Error; delete Item!', '');
              console.log('Error; delete players data: ', error);
              this.loadingData = false;
            });
  }
}
