import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { ApiService } from '../service/api.service';
import { OnInit } from '@angular/core';


// TODO: Replace this with your own data model type
export interface RosterdetailItem {
  jerseyNumber: number;
  first: string;
  last: string;
  memberType: string;
  positions: string[];
  year: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: RosterdetailItem[] = [
  {jerseyNumber: 1, first: 'Sachin', last: 'Tendulkar', memberType: 'Player', positions:['O'], year: '2020'},
  {jerseyNumber: 2, first: 'MS', last: 'Dhoni', memberType: 'Player', positions:['M','W'], year: '2020'},
  {jerseyNumber: 3, first: 'Virat', last: 'Kohli', memberType: 'Player', positions:['M'], year: '2020'},
  {jerseyNumber: 4, first: 'Harbhajan', last: 'Singh', memberType: 'Player', positions:['B'], year: '2020'},
  {jerseyNumber: 5, first: 'Anil', last: 'Kumble', memberType: 'Coach', positions:[], year: '2020'},
];

/**
 * Data source for the Rosterdetail view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RosterdetailDataSource  extends DataSource<RosterdetailItem> {
  data: RosterdetailItem[] = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private apiService: ApiService) {
    super();
    apiService.getItems('rosters').subscribe((data)=>{
      console.log(data[0].JerseyNumber);
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<RosterdetailItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: RosterdetailItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: RosterdetailItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'first': return compare(a.first, b.first, isAsc);
        case 'jerseyNumber': return compare(+a.jerseyNumber, +b.jerseyNumber, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
