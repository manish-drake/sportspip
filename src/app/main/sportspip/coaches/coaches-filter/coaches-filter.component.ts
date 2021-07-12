import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import {  ICoaches, ILevel, IProgram } from '../../interfaces';
import { CoachesService } from '../coaches.service';

@Component({
  selector: 'app-coaches-filter',
  templateUrl: './coaches-filter.component.html',
  styleUrls: ['./coaches-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoachesFilterComponent implements OnInit {

   // Public
   public coachesRef = [];
   public tempRef = [];
   public checkAll = true;
   public levelsRef=[];

  constructor(private _coreSidebarService: CoreSidebarService,private _coachesService: CoachesService) { }


  /**
   * If all checkbox are checked : returns TRUE
   */
   allChecked() {
     //if(e.target.checked==true){
    return this.coachesRef.every(v => v.checked === true);

    // }
  // else{
  //  return this.coachesRef.every(v => v.checked === false);
  // }
  }
   /**
   * Checkbox Change
   *
   * @param event
   * @param id
   */
    checkboxChange(event, id) {
      const index = this.coachesRef.findIndex(r => {
        if (r.id === id) {
          
          return id;
          
        }
      });
      this.coachesRef[index].checked = event.target.checked;
      this._coachesService.coachesUpdate(this.coachesRef);
<<<<<<< HEAD

     
=======
>>>>>>> 3553f0985d89dfa145c72f2ddeaabb48d6a3a65f
      this.checkAll = this.allChecked();
    }

     /**
   * Toggle All Checkbox
   *
   * @param event
   */
  toggleCheckboxAll(event) {
    this.checkAll = event.target.checked;
    if (this.checkAll) {
      this.coachesRef.map(res => {
        res.checked = true;
      });
    } else {
      this.coachesRef.map(res => {
        res.checked = false;
      });
    }
    this._coachesService.coachesUpdate(this.coachesRef);
  }

 /**
   * On init
   */
  
  ngOnInit(): void {
    // Subscribe to Coaches changes
    this._coachesService.onCoachesChange.subscribe(res => {
      this.coachesRef = res; 
    });
   
   
   }
  //  coachesData(){
  //   this._coachesService.getCoache().subscribe(data=> this.coaches = data)
  //   console.log(this.coachesRef);
  //   this.coachArrays=this._coachesService.getCoache().subscribe()
  //   console.log(this.coachArrays);
  //  }
  //  coachArrays:any=[];
  //  coaches:ICoaches[];
  //  coachTempArray:any =[];
  //  coachNewArray:any =[];
  //  onChange(event:any){

  //   if(event.target.checked)
  //   {
  //       this.coachTempArray = this.coachNewArray.filter((e:any)=>e.id == event.target.value);
  //       this.coaches=[];
 
  //       this.coachNewArray.push(this.coachTempArray);

  //       for(let i=0; i<this.coachNewArray.length; i++)
  //       {
  //         var firstArray = this.coachNewArray[i];
  //         console.log(firstArray)
  //         for(let i=0; i<firstArray.length; i++)
  //         {
  //           var obj = firstArray[i];
  //           this.coaches.push(obj);
  //           console.log(this.coaches)
  //         }
  //       }
  //   }
  //   else
  //   {
  //     this.coachTempArray = this.coaches.filter((e:any)=>e.id != event.target.value);
  //     this.coachNewArray=[];
  //     this.coaches=[];
  //     this.coachNewArray.push(this.coachTempArray);
  //     for(let i=0; i<this.coachNewArray.length; i++)
  //     {
  //       var firstArray = this.coachNewArray[i];
  //       console.log(firstArray)
  //       for(let i=0; i<firstArray.length; i++)
  //       {
  //         var obj = firstArray[i];
  //         this.coaches.push(obj);
  //         console.log(this.coaches);
  //       }
  //     }
  //   }
  // }
  
}
