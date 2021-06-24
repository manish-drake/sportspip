
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';


import { Router } from '@angular/router';
import { Delivery } from '../interfaces';
import { DatePipe } from '@angular/common';
import { TaggingService } from './tagging.service';
import { PlyrComponent } from 'ngx-plyr';



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
  bowlerModel: string = '0';
  batsmanModel: string = '0';
  deliveryCount: number = 0;
  deliveryTime: number = 0;
  taggingInProgress: boolean = true;

  plyrOptions: any = {
    preload: 'auto',
    controls: false,
    poster: '',
    sources: [{
      src: '',
      type: 'video/mp4'
    }]
  }

  
  // get the component instance to have access to plyr instance
  @ViewChild(PlyrComponent)

  // or get it from plyrInit event
  public plyr: PlyrComponent;
  public player: Plyr;
 // public plyrOptions = { tooltips: { controls: true } };

  // video Sources
  public videoSources: Plyr.Source[] = [
    {
      src:
        'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
      type: 'video/mp4',
      size: 576
    },
    {
      src:
        'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
      type: 'video/mp4',
      size: 720
    },
    {
      src:
        'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
      type: 'video/mp4',
      size: 1080
    },
    {
      src:
        'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1440p.mp4',
      type: 'video/mp4',
      size: 1440
    }
  ];

  public tracks = [
    {
      kind: 'captions',
      label: 'English',
      srclang: 'en',
      src:
        'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
      default: true
    },
    {
      kind: 'captions',
      label: 'French',
      srclang: 'fr',
      src:
        'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt'
    }
  ];

  public poster =
    'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg';
  

  constructor( private taggingService: TaggingService, private datePipe: DatePipe, private router: Router) {

    this.plyrOptions.sources[0].src = this.taggingService.mediaUri;
    this.session = this.datePipe.transform(this.today, 'yyyy-MM-dd HH:mm:ss');

  }
  ngOnInit() {

    
  }

  Play(): void {
    var video1 = document.querySelector('video');
    video1.play();
  }
  Pause(): void {
    var video1 = document.querySelector('video');
    this.deliveryTime = video1.currentTime;
   // console.log(video1.currentTime);
    video1.pause();
  }
  
  deliveries: Delivery[] = [];

  addDelivery() {
    this.deliveryCount += 1;
    var video1 = document.querySelector('video');
    this.deliveryTime = video1.currentTime;
   // console.log(video1.currentTime);

    let newDelivery: Delivery = new Delivery;

    newDelivery.Session = this.session;
    newDelivery.BatsmanNumber = +this.batsmanModel;

    newDelivery.BowlerNumber = +this.bowlerModel;

    newDelivery.DeliveryCounter = this.deliveryCount;
    newDelivery.DeliveryTime = this.deliveryTime
    newDelivery.LagTime = 5;
    newDelivery.LeadTime = 5;
    newDelivery.Runs = +this.runsModel;

   
    this.taggingService.addDelivery(newDelivery)
      .subscribe(delivery => this.deliveries.push(delivery));
    this.taggingInProgress = !(this.deliveryCount >= 12);

    let myJSON = JSON.stringify(this.taggingInProgress);
    console.log('adddelivery'+myJSON);
  // console.log("rakesh"+this.deliveries)

  }


  review() {
    this.router.navigate(['/sportspip/review', this.session ]);
  }
  onNgModelChange(e) { // here e is a boolean, true if checked, otherwise false
    if (e) {
      console.log(e);
    }

  }

}






