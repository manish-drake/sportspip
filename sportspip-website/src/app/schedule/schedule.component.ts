import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef, Type} from '@angular/core';
import { OverlayService } from '../overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ScheduleDataSource, ScheduleItem } from './schedule-datasource';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ScheduleItem>;
  dataSource: ScheduleDataSource;
  scheduleEditForm: Type<any> = ScheduleFormComponent

  constructor(private overlayService: OverlayService){}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['eventType', 'opponent', 'eventDatetime', 'location', 'DeleteAction'];
  isOpen = false;
  ngOnInit() {
    this.dataSource = new ScheduleDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  open(content: TemplateRef<any> | ComponentType<any> | string, data: any = {}) {
    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {
      let data = res.data;
    });
  }
}
