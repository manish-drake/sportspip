import { Component, OnInit } from '@angular/core';
import { CoachesapiService } from './coachesapi.service';

@Component({
  selector: 'app-coachesfiltercoaches',
  templateUrl: './coachesfiltercoaches.component.html',
  styleUrls: ['./coachesfiltercoaches.component.scss']
})
export class CoachesfiltercoachesComponent implements OnInit {
 
  serverUri:string = "http://drake.in:1337";
  gameFilter: any = [];
  constructor( private _coachesService: CoachesapiService) { }

  ngOnInit() {
    // this._coachesService.getCoache().subscribe(data=> this.coaches = data)
    // console.log(this.coaches);
   this.dataFilter();
   this.filterCoach();
    
    
  }

 
  dataFilter(){
    this._coachesService.filterData().subscribe((data: any[])=>{
      console.log(data);
      this.gameFilter = data;
      console.log(this.gameFilter);
    })  
  }
  coachesArray:any=[];
  arrays:any=[];

  filterCoach(){
    this._coachesService.coachesData().subscribe((data: any[])=>{
      console.log(data);
      this.coachesArray = data;
      console.log(this.coachesArray)
    }) ;

    this._coachesService.coachesData().subscribe((data: any[])=>{
      console.log(data);
      this.arrays = data;
      console.log(this.arrays)
    }) ;
  }

  tempArray:any =[];
  newArray:any =[];

  onChange(event:any){

    if(event.target.checked)
    {
        this.tempArray = this.arrays.filter((e:any)=>e.id == event.target.value);
        this.coachesArray=[];
 
        this.newArray.push(this.tempArray);

        for(let i=0; i<this.newArray.length; i++)
        {
          var firstArray = this.newArray[i];
          console.log(firstArray)
          for(let i=0; i<firstArray.length; i++)
          {
            var obj = firstArray[i];
            this.coachesArray.push(obj);
            console.log(this.coachesArray)
          }
        }
    }
    else
    {
      this.tempArray = this.coachesArray.filter((e:any)=>e.id != event.target.value);
      this.newArray=[];
      this.coachesArray=[];
      this.newArray.push(this.tempArray);
      for(let i=0; i<this.newArray.length; i++)
      {
        var firstArray = this.newArray[i];
        console.log(firstArray)
        for(let i=0; i<firstArray.length; i++)
        {
          var obj = firstArray[i];
          this.coachesArray.push(obj);
          console.log(this.coachesArray);
        }
      }
    }
  }


  
 
}
