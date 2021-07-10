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
  coachTempArray:any =[];
  coachNewArray:any =[];

  onChange(event:any){

    if(event.target.checked)
    {
        this.coachTempArray = this.coachNewArray.filter((e:any)=>e.id == event.target.value);
        this.coaches=[];
 
        this.coachNewArray.push(this.coachTempArray);

        for(let i=0; i<this.coachNewArray.length; i++)
        {
          var firstArray = this.coachNewArray[i];
          console.log(firstArray)
          for(let i=0; i<firstArray.length; i++)
          {
            var obj = firstArray[i];
            this.coaches.push(obj);
            console.log(this.coaches)
          }
        }
    }
    else
    {
      this.coachTempArray = this.coaches.filter((e:any)=>e.id != event.target.value);
      this.coachNewArray=[];
      this.coaches=[];
      this.coachNewArray.push(this.coachTempArray);
      for(let i=0; i<this.coachNewArray.length; i++)
      {
        var firstArray = this.coachNewArray[i];
        console.log(firstArray)
        for(let i=0; i<firstArray.length; i++)
        {
          var obj = firstArray[i];
          this.coaches.push(obj);
          console.log(this.coaches);
        }
      }
    }
  }

}
