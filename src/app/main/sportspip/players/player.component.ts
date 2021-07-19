import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../interfaces';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  serverUri:string = "http://drake.in:1337";

  public checkAll = true;
  playerCollection:IPlayer;
  player:IPlayer[];

  public contentHeader: object;

  constructor(private _playerService : PlayerService) { }

 

  ngOnInit(): void {

   // this._playerService.getPlayer().subscribe(data=> this.player = data)

     // content header
     this.contentHeader = {
      headerTitle: 'Players',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          // {
          //   name: '',
          //   isLink: true,
          //   link: '/'
          // },
          {
            name: 'Players',
            isLink: false
          }
        ]
      }
    };
    this.dataFilter();
    this. filterplayer();
    
  }


    //--------------------------subscribed data for for checkbox-----------------------------//

    gameFilter: any = [];

    dataFilter() {
      this._playerService.filterData().subscribe((data: any[]) => {
        console.log(data);
        this.gameFilter = data;
        console.log(this.gameFilter);
      });
    }
  
    //----------------------subscribed coach data-----------------------------//
    coachesArray:IPlayer[]
    arrays: IPlayer[];
  
    filterplayer() {
      this._playerService.getPlayer().subscribe((data: any[]) => {
        console.log(data);
        this.coachesArray = data;
        this.arrays = this.coachesArray;
        console.log(this.coachesArray)
      });
    }
  
    //--------------------------toggle checkbox logic--------------------------------//
    toggleCheckboxAll(event) {

      if (event.target.checked) {
  
        this.tempArray = this.arrays;
  
        this.coachesArray = [];
  
        this.newArray.push(this.tempArray);
  
        for (let i = 0; i < this.newArray.length; i++) {
          var firstArray = this.newArray[i];
          console.log(firstArray)
          
          for (let i = 0; i < firstArray.length; i++) {
            var obj = firstArray[i];
            this.coachesArray.push(obj);
            console.log(this.coachesArray)
          }
        }
      }
      else {
        this.coachesArray = [];
        this.tempArray = this.coachesArray
        this.newArray = [];
        this.coachesArray = [];
        this.newArray.push(this.tempArray);
        for (let i = 0; i < this.newArray.length; i++) {
          var firstArray = this.newArray[i];
          console.log(firstArray)
          for (let i = 0; i < firstArray.length; i++) {
            var obj = firstArray[i];
            this.coachesArray.push(obj);
            console.log(this.coachesArray);
          }
        }
      }
  
  
      ///-----------------toggle checkbox------------//
  
      this.checkAll = event.target.checked;
  
      if (this.checkAll) {
        this.gameFilter.map(res => {
          res.checked = true;
        });
      } else {
        this.gameFilter.map(res => {
          res.checked = false;
          this.coachesArray = [];
  
        });
      }
  
    }
  
  
    //---------------------logic for filter coach --------------------------//
    tempArray: any = [];
    newArray: any = [];
  
    onChange(event: any, id) {
  
      if (event.target.checked) {
        this.tempArray = this.arrays.filter((e: any) => e.filter == event.target.value);
        this.coachesArray = [];
  
        this.newArray.push(this.tempArray);
  
        for (let i = 0; i < this.newArray.length; i++) {
          var firstArray = this.newArray[i];
          console.log(firstArray)
          for (let i = 0; i < firstArray.length; i++) {
            var obj = firstArray[i];
            this.coachesArray.push(obj);
            console.log(this.coachesArray)
          }
        }
      }
  
      else {
  
        this.tempArray = this.coachesArray.filter((e: any) => e.filter != event.target.value);
        this.newArray = [];
        this.coachesArray = [];
        this.newArray.push(this.tempArray);
        for (let i = 0; i < this.newArray.length; i++) {
          var firstArray = this.newArray[i];
          console.log(firstArray)
          for (let i = 0; i < firstArray.length; i++) {
            var obj = firstArray[i];
            this.coachesArray.push(obj);
            console.log(this.coachesArray);
          }
        }
      }
      const index = this.gameFilter.findIndex(r => {
        if (r.id === id) {
          return id;
        }
      });
      this.gameFilter[index].checked = event.target.checked;
  
      this.checkAll = this.allChecked();
    }
  
    //-----------------checkbox select all------------------------//
    allChecked() {
      return this.gameFilter.every(v => v.checked === true);
  
    }

}
