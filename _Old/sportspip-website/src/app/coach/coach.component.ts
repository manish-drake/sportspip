import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../service/api.service';
import { OverlayHandle } from '../overlay-handle';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {

  loadingData: Boolean = false;
  apiURL: string = '';
  coachId: string = '';
  coach: any = {};
  sports: string = '';
  levels: string = '';
  programs: string = '';
  years: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService, private handle: OverlayHandle) {
    // this.route.params.subscribe(params => this.coachId = params.id);
    this.coachId = handle.data;
  }

  ngOnInit(): void {
    this.FetchItem();
    this.apiURL = this.apiService.getApiUrl();
  }

  FetchItem(): void {
    this.loadingData = true;
    this.apiService.getItems('coaches/' + this.coachId)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.coach = data;
          //console.log(this.coach.sports);
          this.sports = this.coach.sports.map(e => e.Name).join(", ");
          this.levels = this.coach.levels.map(e => e.Name).join(", ");
          this.programs = this.coach.programs.map(e => e.Name).join(", ");
          this.years = this.coach.years.map(e => e.Name).join(", ");
        },
        (error) => {
          console.log("Error; get coach data: ", error);
          this.loadingData = false;
        }
      );
  }
  close() {
    this.handle.close(null);
  }
}
