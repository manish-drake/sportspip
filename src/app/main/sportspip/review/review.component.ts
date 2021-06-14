  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute } from '@angular/router';
import { Delivery } from '../interfaces';
import { TaggingService } from '../tagging/tagging.service';
  

  @Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
  })
  export class ReviewComponent implements OnInit {

    forSession: string;
    deliveries : Delivery[];
    pivotData: any;
    tabelHeaders:string[] = [];
    
    playerOptions: any = {
      preload: 'auto',
      controls: false,
      poster: '',
      sources: [{src: '',
      type: 'video/mp4'}]}

    constructor(private taggingService:TaggingService, private route: ActivatedRoute) { 
      this.playerOptions.sources[0].src = this.taggingService.mediaUri;

      this.forSession = this.route.snapshot.paramMap.get('session');
      console.log("param: " + this.forSession);

      this.taggingService.getDeliveriesBySession(this.forSession).subscribe(dl=>{
        this.deliveries = dl;
        console.log(this.deliveries);

        this.taggingService.getPivot(this.deliveries).subscribe(piv=>{
          this.pivotData = piv;
          console.log(this.pivotData);
        });
        
      })
    }

    formatHeader(hdr:string, runs:string): string{
      console.log(runs)
      if(runs==="Runs_0")
      {
        return hdr;
      }
      else{
        return "";
      }
    }

    ngOnInit(): void {
      this.Play();
    }

    move(ts: string): void{
      console.log(ts)
      var video1 = document.querySelector('video');
      video1.currentTime=+ts;
    }

    Play(): void{
      var video1 = document.querySelector('video');
      video1.play();
    }
    
    Pause(): void{
      var video1 = document.querySelector('video');
      console.log(video1.currentTime);
      video1.pause();
    }
  }
