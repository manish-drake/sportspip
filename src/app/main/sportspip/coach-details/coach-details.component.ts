import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoachesService } from '../coaches/coaches.service';
import { ICoaches } from '../interfaces';


@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CoachDetailsComponent implements OnInit {

  coachId:string ="";
  coachCollection: ICoaches;
  
  constructor(private activatedRoute: ActivatedRoute, private _coachesService:CoachesService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.coachId = this.activatedRoute.snapshot.queryParamMap.get('coachId');
      console.log('Url Id: ', this.coachId);
      this._coachesService.getCoachX(this.coachId).subscribe(
        data=> {
          this.coachCollection = data[0] as ICoaches;
          console.log(this.coachCollection);
        }
      );
    });
  }

}
