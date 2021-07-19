import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlyrComponent } from 'ngx-plyr';
import { Delivery } from '../interfaces';
import { TaggingService } from '../tagging/tagging.service';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {
  public contentHeader: object;

  forSession: string;
  deliveries: Delivery[];
  pivotData: any;
  tabelHeaders: string[] = [];

  plyrOptions: any = {
    preload: 'auto',
    controls: false,
    poster: '',
    sources: [{
      src: '',
      type: 'video/mp4'
    }]
  }
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
  

  constructor(private taggingService: TaggingService, private route: ActivatedRoute) {
    this.plyrOptions.sources[0].src = this.taggingService.mediaUri;

    
    this.forSession = this.route.snapshot.paramMap.get('session');
    console.log("param: " + this.forSession);

    this.taggingService.getDeliveriesBySession(this.forSession).subscribe(dl => {
      this.deliveries = dl;
      //  debugger
      let myJSON = JSON.stringify(this.deliveries);
        console.log('getdeliveriesBysession'+myJSON);
     // console.log( "abc"+this.deliveries);

      this.taggingService.getPivot(this.deliveries).subscribe(piv => {
        this.pivotData = piv;
        let myJSON = JSON.stringify(this.pivotData);
        console.log('get pivot'+myJSON);
      });

    })
  }

  formatHeader(hdr: string, runs: string): string {
    console.log(runs)
    if (runs === "Runs_0") {
      console.log(hdr)
      return hdr;
    }
    else {
      return "";
    }
  }

  ngOnInit(): void {

    // this._playerService.getPlayer().subscribe(data=> this.player = data)
 
      // content header
      this.Play();
      this.contentHeader = {
       headerTitle: 'Review',
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
             name: 'Review',
             isLink: false
           }
         ]
       }
     };
     
   }

  move(ts: string): void {
    console.log(ts)
    var video1 = document.querySelector('video');
    video1.currentTime = +ts;
  }

  Play(): void {
    var video1 = document.querySelector('video');
    video1.play();
  }

  Pause(): void {
    var video1 = document.querySelector('video');
    console.log(video1.currentTime);
    video1.pause();
  }
}
