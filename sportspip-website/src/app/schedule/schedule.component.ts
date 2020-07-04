import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef, Type} from '@angular/core';
import { OverlayService } from '../overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { ApiService } from '../service/api.service';

export interface ScheduleItem {
  eventType: string;
  opponent: string;
  eventDatetime: Date
  location: string
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
  scheduleEditForm: Type<any> = ScheduleFormComponent
  
  constructor(private overlayService: OverlayService, private apiService: ApiService){}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['eventType', 'opponent', 'eventDatetime', 'location', 'DeleteAction'];
  isOpen = false;
  ngOnInit() {
    this.dataSource = new MatTableDataSource<ScheduleItem>([]);

    this.apiService.getItems('events').subscribe(item => {
      let newData: ScheduleItem[] = [];
      (item as any[]).forEach(row => {
        newData.push({
          'eventType': row.EventType, 
          'opponent': row.Opponent, 
          'eventDatetime': new Date(row.EventDate), 
          'location': row.Location,
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
  open(content: TemplateRef<any> | ComponentType<any> | string, data: any = {}) {
    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {
      let modData = res.data;
       data.eventType = modData.eventType;
       data.opponent = modData.opponent;
       data.eventDatetime = modData.eventDatetime;
       data.location = modData.location;
       this.apiService.updateItem("events", data).subscribe(result=>{
          let resp = result;
       });
    });
  }
}
