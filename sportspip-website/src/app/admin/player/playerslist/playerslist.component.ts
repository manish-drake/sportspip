import {ComponentType} from '@angular/cdk/portal';
import {Component, OnInit, TemplateRef, Type, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {OverlayService} from 'src/app/overlay.service';

import {ApiService} from '../../../service/api.service';
import {AddeditplayerComponent} from '../addeditplayer/addeditplayer.component';

@Component({
  selector: 'app-playerslist',
  templateUrl: './playerslist.component.html',
  styleUrls: ['./playerslist.component.scss']
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
  displayedColumns: string[] = [
    'FirstName', 'LastName', 'Height', 'Hometown', 'createdAt', 'DeleteAction'
  ];
  // dataSource: any;
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  crudPlayer: Type<AddeditplayerComponent> = AddeditplayerComponent;

  constructor(
      private apiService: ApiService, private router: Router,
      private _snackBar: MatSnackBar, private overlayService: OverlayService) {}


  ngOnInit(): void {
    this.apiURL = this.apiService.getPlayerApiUrl();
    this.FetchItems();    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  FetchItems(): void {
    this.loadingData = true;
    this.apiService.getItems('players',this.apiURL).subscribe(
        (data) => {
          this.loadingData = false;
          this.items = data;
          this.dataSource.data = this.items;
          this.dataSource.paginator = this.paginator;
          // console.log(this.sort);
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.log('Error; get coaches data: ', error);
          this.loadingData = false;
        });
  }

  FormatDate(value) {
    var st = value;
    let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
    let date = new Date(st.replace(pattern, '$1-$2-$3 $4:$5:$6'));
    return date;
  }
  swap(swapPlayer: any, withPlayer: any) {
    swapPlayer.Class = withPlayer.Class;
    swapPlayer.Description = withPlayer.Description;
    swapPlayer.FirstName = withPlayer.FirstName
    swapPlayer.Height = withPlayer.Height
    swapPlayer.HomeTown = withPlayer.HomeTown
    swapPlayer.LastName = withPlayer.LastName
    swapPlayer.ProfileImage = withPlayer.ProfileImage
    swapPlayer.Weight = withPlayer.Weight
    swapPlayer.level = withPlayer.level
    swapPlayer.program = withPlayer.program
    swapPlayer.sport = withPlayer.sport
    swapPlayer.years = withPlayer.years
  }

  DeleteItem(id: any) {
    console.log(id);
    this.loadingData = true;
    this.apiService.deleteItem('players', id,this.apiURL)
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

  EditItem(id: any) {
    // console.log("id:  " + id);
    this.router.navigate(['/admin/player', id]);
  }

  AddItem() {
    // console.log("id:  " + id);
    this.router.navigate(['/admin/player/add']);
  }
  open(content: TemplateRef<any>|ComponentType<any>|string, data: any = {}) {
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
