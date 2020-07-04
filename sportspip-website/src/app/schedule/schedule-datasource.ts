import {DataSource} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '../service/api.service';

// TODO: Replace this with your own data model type
export interface ScheduleItem {
  eventType: string;
  opponent: string;
  eventDatetime: Date
  location: string
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ScheduleItem[] = [
  {
    eventType: 'Regular Season',
    opponent: 'Oppo Team 1',
    eventDatetime: new Date('2020-05-20'),
    location: 'Liverpool'
  },
  {
    eventType: 'Profession',
    opponent: 'Oppo Team 2',
    eventDatetime: new Date('2020-07-13'),
    location: 'Oxford'
  },
  {
    eventType: 'Tournament',
    opponent: 'Oppo Team 3',
    eventDatetime: new Date('2020-10-27'),
    location: 'London'
  },
];

/**
 * Data source for the Schedule view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ScheduleDataSource extends DataSource<ScheduleItem> {
  data: ScheduleItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;
  
  constructor(private apiService: ApiService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ScheduleItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations =
        [observableOf(this.data), this.paginator.page, this.sort.sortChange];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during
   * connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ScheduleItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ScheduleItem[]) {data
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name':
          return compare(a.opponent, b.opponent, isAsc);
        case 'id':
          return compare(a.location, b.location, isAsc);
        default:
          return 0;
      }
    });
  }
}

/**
 * Simple sort comparator for example ID/Name columns (for client-side
 * sorting).
 */
function compare(a: string|number, b: string|number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
