import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ICoaches, ILevel, IProgram } from '../interfaces';
import { CoachesService } from './coaches.service';


@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss'],
  
})
export class CoachesComponent implements OnInit {

  serverUri:string = "http://drake.in:1337";

  public contentHeader: object;
  
  constructor(private _coachesService: CoachesService) { }

  level: ILevel[];
  program: IProgram[];
  coaches:ICoaches[];
  stringifiedData: any;
  coachArrays:any=[];
  ngOnInit() {
   
    
    this.coachesData();


    // content header
    this.contentHeader = {
      headerTitle: 'Coaches',
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
            name: 'Coaches',
            isLink: false
          }
        ]
      }
    };
  }
  coachesData(){
    this._coachesService.getCoache().subscribe(data=> this.coaches = data)
    console.log(this.coaches);
    this.coachArrays=this._coachesService.getCoache().subscribe()
    console.log(this.coachArrays);
    

    // this.stringifiedData = JSON.stringify(this.coaches);  
    // console.log("With Stringify :" + this.stringifiedData); 
  }
 

  

}
