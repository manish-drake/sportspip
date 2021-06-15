import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Delivery } from '../interfaces';
import { TaggingService } from './tagging.service';
 
  @Component({
    selector: 'app-tagging',
    templateUrl: './tagging.component.html',
    styleUrls: ['./tagging.component.scss'],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None
    
  })
  export class TaggingComponent implements OnInit {
  
    today = new Date();
    session: string = '05-03-2021 12:00:00';
    runsModel: string = '0';
    bowlerModel:string = '0';
    batsmanModel:string = '0';
    deliveryCount: number = 0;
    deliveryTime:number = 0;
    taggingInProgress:boolean =true;

    playerOptions: any = {
      preload: 'auto',
      controls: false,
      poster: '',
      sources: [{src: '',
      type: 'video/mp4'}]}

    constructor(private taggingService: TaggingService, private datePipe: DatePipe, private router: Router){

      this.playerOptions.sources[0].src = this.taggingService.mediaUri;
      this.session = this.datePipe.transform(this.today, 'yyyy-MM-dd HH:mm:ss');
     
    }
    ngOnInit(){
    }

    Play(): void{
      var video1 = document.querySelector('video');
      video1.play();
    }
    Pause(): void{
      var video1 = document.querySelector('video');
      this.deliveryTime = video1.currentTime;
      console.log(video1.currentTime);
      video1.pause();
    }
    
    deliveries : Delivery[] = [];

    addDelivery(): void{
      this.deliveryCount += 1;
      var video1 = document.querySelector('video');
      this.deliveryTime = video1.currentTime;
      console.log(video1.currentTime);
      let newDelivery: Delivery = new Delivery;
      newDelivery.session = this.session;
      newDelivery.batsmanNumber = +this.batsmanModel;
      console.log(this.batsmanModel);
      newDelivery.bowlerNumber = +this.bowlerModel;
      console.log(this.bowlerModel);
      newDelivery.deliveryCounter = this.deliveryCount;
      newDelivery.deliveryTime = this.deliveryTime
      newDelivery.lagTime = 5;
      newDelivery.leadTime = 5;
      newDelivery.runs = +this.runsModel;
      
      this.taggingService.addDelivery(newDelivery)
        .subscribe(delivery => this.deliveries.push(delivery));
      this.taggingInProgress = !(this.deliveryCount >= 12);
    }

    review(){
      this.router.navigate(['app/main/sportspip/review', this.session]);
    }
    onNgModelChange(e) { // here e is a boolean, true if checked, otherwise false
      if(e){
        console.log(e);
      }
    }
  }
    
  

    


