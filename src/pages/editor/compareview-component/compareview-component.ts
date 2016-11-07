import { Component, ViewChild, Input, ElementRef } from '@angular/core';

import { AlertController, ModalController, Platform, PopoverController, ViewController, NavParams } from 'ionic-angular';

declare var cordova: any;

@Component({
    selector: 'compareview-component',
    templateUrl: 'compareview-component.html'
})

export class CompareviewComponent {

    @Input() view: any;

    @Input() views: any;

    @Input() isSelected: boolean;

    isLinked: boolean = false;
    linkUnlinkIcon: string = "remove";

    sliderValue: any = 0;
    timelinePosition: any;
    timelineDuration: any;
    playPauseButtonIcon: string;

    videoSrcAvailable: boolean = true;

    viewBoxSize: any;

    constructor(private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private platform: Platform,
        private popoverCtrl: PopoverController) {
        this.playPauseButtonIcon = "play";
        this.timelinePosition = this.formatTime(0);
    }


    @ViewChild('videoElement') videoElement: ElementRef;
    video: HTMLVideoElement;

    timelineInterval: any = null;

    ngAfterViewInit() {
        console.log(this.view);
        this.markers = this.view["Content"]["Capture"]["View.ChronoMarker"]["ChronoMarker"];
        this.loadObjects();
        this.loadMarkerObjects();

        this.video = this.videoElement.nativeElement;

        this.video.addEventListener('ended', () => {
            this.playPauseButtonIcon = "play";
            clearInterval(this.timelineInterval);
        })

        this.video.addEventListener('error', (error) => {
            this.videoSrcAvailable = false;
        })

        setInterval(() => {
            this.timelineDuration = this.formatTime(this.video.duration);
            this.viewBoxSize = '0 0 ' + this.video.videoWidth + ' ' + this.video.videoHeight;
            this.evaluateMarkerPosition();
        }, 1);
    }

    selectView(event) {
        let popover = this.popoverCtrl.create(CaptureViewsPopover);
        popover.present({ ev: event });
    }

    updateLink() {
        if (!this.isLinked) {
            this.isLinked = true;
            this.linkUnlinkIcon = "link";
        }
        else {
            this.isLinked = false;
            this.linkUnlinkIcon = "remove";
        }

    }

    returnVidPath(filename) {
        if (this.platform.is('cordova')) {
            return cordova.file.applicationStorageDirectory + filename;
        }
        else {
            return 'assets/' + filename;
        }
    }

    formatTime(time) {
        var hrs = Math.floor(time / 3600);
        var hours = (hrs >= 10) ? hrs : "0" + hrs;
        var min = Math.floor(time / 60);
        var minutes = (min >= 10) ? min : "0" + min;
        var sec = Math.floor(time % 60);
        var seconds = (sec >= 10) ? sec : "0" + sec;
        var milliseconds = time.toFixed(2).substr(-2);
        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    sliderValueChange() {
        this.timelinePosition = this.formatTime(this.video.currentTime);
        var factor = this.video.duration * (this.sliderValue / 100000);
        this.video.currentTime = factor;
    }

    playPause() {
        if (this.video.paused == true) {
            this.video.play();
            this.playPauseButtonIcon = "pause";
            this.timelineInterval = setInterval(() => {

                var factor = (100000 / this.video.duration) * this.video.currentTime;
                this.sliderValue = factor;
                this.timelinePosition = this.formatTime(this.video.currentTime);
            }, 1);
        } else {
            this.video.pause();
            this.playPauseButtonIcon = "play";
            clearInterval(this.timelineInterval);
        }
    }

    playbackRateVideo() {
        var speed = this.video.playbackRate;
        switch (speed) {
            case 0.5:
                speed = speed + 0.5;
                break;
            case 1:
                speed = speed + 0.5;
                break;
            case 1.5:
                speed = speed + 0.5;
                break;
            case 2:
                speed = speed - 1.5;
                break;
            default:
                speed = 1;
                break;
        }
        this.video.playbackRate = speed;
    }

    // Code for Markers starts
    markers = [];

    @ViewChild('markersContainer') markersContainer;

    onResize(event) { this.evaluateMarkerPosition(); }

    evaluateMarkerPosition() {
        var markersContainerWidth = this.markersContainer.nativeElement.clientWidth;
        var durationInMilliseconds = Number(this.timelineDuration.slice(1, 2)) * 36000000000 + Number(this.timelineDuration.slice(4, 5)) * 60000000 + Number(this.timelineDuration.slice(7, 8)) * 10000000 + Number(this.timelineDuration.substr(-2)) * 100000;
        var factor = markersContainerWidth / durationInMilliseconds;

        this.markers.forEach(marker => {
            var pos = marker._Position;
            var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
            marker.Left = positionInMilliseconds * factor + 'px';
        });

        // return positionInMilliseconds * factor + 'px';
    }

    updateSelection(i) {
        this.markers.forEach((marker, index) => {
            if (i != index)
                marker.checked = false;
            else
                marker.checked = true;
        });
    }
    // Code for Markers ends

    //Code for objects starts
    clrCvt(color) {
        return '#' + color.slice(3, 9);
    }

    sum(a, b) {
        return Number(a) + Number(b);
    }

    objects = [];

    loadObjects() {
        var objs = this.view["Content"]["Capture"]["Marker"]["Marker.Objects"];

        for (var key in objs) {
            // skip loop if the property is from prototype
            if (!objs.hasOwnProperty(key)) continue;
            var val = objs[key];

            if (val instanceof Array) {
                val.forEach(val => {
                    this.objects.push({ key, val });
                });
            }
            else {
                this.objects.push({ key, val });
            }
        }
        console.log(this.objects);
    }

    markersObjects = []

    loadMarkerObjects() {
        var interval = setInterval(() => {
            if (this.markers != undefined) {

                clearInterval(interval);

                this.markers.forEach(data => {
                    var objs = data['Marker.Objects'];

                    var objects = [];

                    for (var key in objs) {
                        // skip loop if the property is from prototype
                        if (!objs.hasOwnProperty(key)) continue;
                        var val = objs[key];

                        if (val instanceof Array) {
                            val.forEach(val => {
                                objects.push({ key, val });
                            });
                        }
                        else {
                            objects.push({ key, val });
                        }
                    }

                    this.markersObjects.push({ data, objects })

                });
                console.log(this.markersObjects);
            }
        }, 1);
    }
    //Code for objects end
}

@Component({
    template: `
    <ion-list radio-group no-margin>
  <ion-item *ngFor="let view of views">
    <ion-label>{{view._Title}}</ion-label>
    <ion-radio checked="true" value="go" (click)="viewChanged()"></ion-radio>
  </ion-item>
</ion-list>
  `
})
export class CaptureViewsPopover {
    views = [{_Title: 'view 1'},{_Title: 'view 2'}];

    constructor(public viewCtrl: ViewController,
    private navParams: NavParams) {

    }

    ionViewDidLoad() {
        console.log('Hello views list popover');
        // this.views = this.navParams.get('views');
        // console.log(this.views);
    }

    viewChanged(){
        this.viewCtrl.dismiss();
    }

}