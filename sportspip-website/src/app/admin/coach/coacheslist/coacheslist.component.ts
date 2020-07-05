import { Component, OnInit, ViewChild, Pipe, PipeTransform, AfterViewInit, TemplateRef, Type } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from 'src/app/overlay.service';
import { UpdatecoachComponent } from '../updatecoach/updatecoach.component';
import { Title } from '@angular/platform-browser';

@Pipe({
  name: 'filtercoach'
})
export class FilterCoachPipe implements PipeTransform {
  transform(dataSource: any): any {
    console.log(dataSource);

    return dataSource;
  }
}


@Component({
  selector: 'app-coacheslist',
  templateUrl: './coacheslist.component.html',
  styleUrls: ['./coacheslist.component.css']
})
export class CoacheslistComponent implements OnInit, AfterViewInit {

  apiURL: string = '';
  items: any = [];
  selectedProgram: any = '';
  selectedYear: any = '';
  selectedGame: any = '';
  selectedLevel: any = '';
  sortcoachOrder: string = 'LastName';
  loadingData: Boolean = false;
  displayedColumns: string[] = ["FirstName", "LastName", "Title", "createdAt", "DeleteAction"];
  //dataSource: any;
  dataSource = new MatTableDataSource([]);
  crudComponent: Type<UpdatecoachComponent> = UpdatecoachComponent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    private overlayService: OverlayService) { }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }

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
    this.apiService.getItems('coaches')
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
          this.dataSource.data = this.items;
          this.dataSource.paginator = this.paginator;
         // console.log(this.sort);
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

  swap(swapCoach: any, withCoach: any) {
    swapCoach.FirstName                 =  withCoach.FirstName
    swapCoach.LastName                  =  withCoach.LastName
    swapCoach.ProfileImage              =  withCoach.ProfileImage
    swapCoach.Title                     =  withCoach.Title
    swapCoach.levels                    =  withCoach.levels
    swapCoach.programs                  =  withCoach.programs
    swapCoach.sports                    =  withCoach.sports
    swapCoach.years                     =  withCoach.years

  }
  DeleteItem(id: any) {
    console.log(id);
    this.loadingData = true;
    this.apiService.deleteItem('coaches', id)
      .subscribe(
        (data) => {
          //console.log(data);
          this.openSnackBar("Item deleted successfully!", "");
          this.FetchItems();
          //this.items = data;
        },
        (error) => {
          this.openSnackBar("Error; delete Item!", "");
          console.log("Error; get coaches data: ", error);
          this.loadingData = false;
        }
      );
  }

  EditItem(id: any) {
    //console.log("id:  " + id);
    this.router.navigate(['/admin/coach', id]);
  }

  AddItem() {
    //console.log("id:  " + id);
    // this.router.navigate(['/admin/coach/add']);

  }

  updateSportsFilter(emittedValue) {
    this.selectedGame = emittedValue;
  }

  updateLevelsFilter(emittedValue) {
    this.selectedLevel = emittedValue;
  }

  updateProgramsFilter(emittedValue) {
    this.selectedProgram = emittedValue;
  }

  updateYearsFilter(emittedValue) {
    this.selectedYear = emittedValue;
  }
  open(content: TemplateRef<any> | ComponentType<any> | string, data: any = {}) {
    const ref = this.overlayService.open(content, data);

    ref.afterClosed$.subscribe(res => {
      let modData = res.data;
      console.log(modData);
      if (modData !== undefined) {
        let updateElement =
            this.dataSource.data.find(element => element.id === modData.id);
        if (updateElement === undefined) {
          let newData = this.dataSource.data.slice();
          newData.push(modData);
          this.dataSource.data = newData;
        } else {
          this.swap(updateElement, modData);
        }
      }
    });
  }

}
