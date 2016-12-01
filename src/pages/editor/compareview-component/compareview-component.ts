import { Component, ViewChild, Input, ElementRef, Output, EventEmitter } from '@angular/core';

import { AlertController, ModalController, Platform, PopoverController, ViewController, NavParams } from 'ionic-angular';

declare var cordova: any;

@Component({
    selector: 'compareview-component',
    templateUrl: 'compareview-component.html',
    providers: [CompareviewComponent]
})

export class CompareviewComponent {

    @Input() view: any;
    @Input() views: any;
    @Input() isSelected: boolean;

    isLinked: boolean = false;
    linkUnlinkIcon: string = "remove";

    @ViewChild('video') videoElement: ElementRef;

    @ViewChild('fadableTitle') fadableTitle: ElementRef;

    video: HTMLVideoElement;

    constructor(private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private platform: Platform,
        private popoverCtrl: PopoverController) {

        this.playPauseButtonIcon = "play";
        this.timelinePosition = this.formatTime(0);
    }

    sliderValue: any = 0;
    timelinePosition: any;
    timelineDuration: any;
    playPauseButtonIcon: string;
    objectss = [];
    videoSrcAvailable: boolean = true;
    markersDirectory = [];
    index = 0;
    markersobjects = [];
    viewBoxSize: any;

    ngAfterViewInit() {
        this.loadObjects();
        this.LoadMarkers();
        this.video = this.videoElement.nativeElement;

        this.video.addEventListener('timeupdate', () => {
            var factor = (100000 / this.video.duration) * this.video.currentTime;
            this.sliderValue = factor;
            this.timelinePosition = this.formatTime(this.video.currentTime);
            if (this.timelinePosition == this.timelineDuration) {
                this.playPauseButtonIcon = 'play';
            }
            this.PlayMarker();
            this.PlayStoryBoard();
        });

        this.video.addEventListener('ended', () => {
            var val = this.markers.find(x => x.checked == true);
            if (val == undefined) {
                this.playPauseButtonIcon = 'play';
            }
        });

        this.video.addEventListener('error', (error) => {
            console.log('Video Error: ' + error);
            // this.videoSrcAvailable = false;
        })

        var interval = setInterval(() => {
            if (this.timelineDuration == undefined || this.timelineDuration == "00:00:00.00" || this.viewBoxSize == "0 0 0 0") {
                this.timelineDuration = this.formatTime(this.video.duration);
                this.viewBoxSize = '0 0 ' + this.video.videoWidth + ' ' + this.video.videoHeight;
            }
            else {
                clearInterval(interval);
                this.evaluateMarkerPosition();
            }
        }, 1 / 60);

        var markerCheckInterval = setInterval(() => {
            this.markers.forEach(element => {
                if (element.checked = true) {
                    element.checked = false;
                }
            });
            clearInterval(markerCheckInterval);
        })

        this.fade(this.fadableTitle.nativeElement);
    }

    LoadMarkers() {
        var chronoMarker = this.view["Content"]["Capture"]["View.ChronoMarker"]["ChronoMarker"];
        if (chronoMarker != undefined) {

            if (chronoMarker instanceof Array) this.markers = chronoMarker;
            else this.markers.push(chronoMarker);
            this.evaluateMarkerPosition();
        }
    }

    fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(() => {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.01;
        }, 30);
    }

    presentViewPopover(event) {
        let popover = this.popoverCtrl.create(CaptureViewsPopover, {
            views: this.views,
            view: this.view
        });
        popover.present({ ev: event });

        popover.onDidDismiss(data => {
            if (data != null) {
                this.view = data;
                this.reloadViewData();
            }
        });
    }
    reloadViewData() {
        this.markers = [];
        this.objects = [];
        this.loadObjects();
        this.LoadMarkers();
    }

    updateLink() {
        if (!this.isLinked) {
            console.log(this.views);
            this.isLinked = true;
            this.linkUnlinkIcon = "link";
        }
        else {
            console.log(this.views);
            this.isLinked  = false;
            this.linkUnlinkIcon = "remove";
        }
 
    }

    playPauseParent() {
        if (this.isLinked) {
            //
            this.playPause();
        }
        else {
            this.playPause();
        }
    }

    playPause() {
        if (this.video.paused == true) {
            if (this.formatTime(this.video.currentTime) == this.timelineDuration) {
                this.markersobjects = [];
                this.markersDirectory = [];
            }
            this.video.play();
            this.playPauseButtonIcon = 'pause';
        } else {
            this.video.pause();
            this.playPauseButtonIcon = 'play';
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
        this.timelinePosition = this.formatTime(factor);
        this.PlayStoryBoard();
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

    onResize(event) {
        this.evaluateMarkerPosition();
    }

    evaluateMarkerPosition() {

        var interval = setInterval(() => {

            var markersContainerWidth = this.markersContainer.nativeElement.clientWidth;
            var durationInMilliseconds = this.formatDurationInMiliSecond(this.timelineDuration);
            if (markersContainerWidth != 0 && this.timelineDuration != undefined) {
                var factor = markersContainerWidth / durationInMilliseconds;

                this.markers.forEach(marker => {
                    var pos = marker._Position;
                    var positionInMilliseconds = this.formatPoistionInMiliSecond(pos);
                    marker.Left = positionInMilliseconds * factor + 'px';
                });
                clearInterval(interval);

                // return positionInMilliseconds * factor + 'px';

            }
        }, 1 / 60)
        // var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
        // return positionInMilliseconds * factor + 'px';
    }




    updateSelection(i, isSelect) {

        this.markers.forEach((marker, index) => {
            if (i != index) {
                marker.checked = false;
                this.video.pause();
                this.playPauseButtonIcon = 'play';
            }
            else {
                if (isSelect) {
                    marker.checked = false;
                }
                else {
                    marker.checked = true;
                    this.index = 0;

                    this.timelinePosition = marker._Position;
                    var positionMS = this.formatPoistionInMiliSecond(marker._Position);
                    var formatPosition = positionMS / 10000000;

                    this.video.currentTime = formatPosition;
                    var factor = (100000 / this.video.duration) * this.video.currentTime;
                    this.sliderValue = factor;
                    this.timelinePosition = this.formatTime(formatPosition);
                }
            }
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
        if (objs != undefined) {
            for (var key in objs) {
                // skip loop if the property is from prototype
                if (!objs.hasOwnProperty(key)) continue;
                var val = objs[key];

                if (val instanceof Array) {
                    val.forEach(val => {
                        this.objects.push({ key, val });
                        console.log(this.objects.length, "object");
                    });
                }
                else {
                    this.objects.push({ key, val });
                    console.log(this.objects.length, "object");
                }
            }
        }
    }

    PlayMarker() {
        var val = this.markers.find(x => x.checked == true)
        if (val != undefined) {
            var positionMS = this.formatPoistionInMiliSecond(val._Position);
            var durationMS = this.formatDurationInMiliSecond(val._Duration);

            var endMarkerDur = durationMS + positionMS;
            var endPlayDur = this.formatTime(endMarkerDur / 10000000);

            var fp = positionMS / 10000000;

            if (this.formatTime(this.video.currentTime) == endPlayDur) {
                this.video.pause();
                this.video.currentTime = fp;
                this.video.play();
            }
        }
    }

    PlayStoryBoard() {
        var marker = this.markers.find(x => x.checked == true)
        if (marker != undefined && this.index == 0) {

            this.markersobjects = [];
            this.markersDirectory = [];
            this.InvalidateObjects(marker);
            this.index = 1;
        }
        else if (marker == undefined) {
            this.markers.forEach(mar => {
                this.InvalidateObjects(mar);
                this.RemoveObjects();
            });
        }
    }

    RemoveObjects() {
        var objects = this.markersobjects.find(x => this.formatTime(this.video.currentTime) >= x.totalDuartion)
        if (objects != null) {
            this.markersobjects.splice(objects, 1);
        }
    }

    InvalidateObjects(selctedMarker) {
        var objs = selctedMarker["Marker.Objects"];

        if (selctedMarker._Position == "00:00:00") {
            if (this.IsMarkerObjectExist(selctedMarker) == -1) {
                var durationMS = this.formatDurationInMiliSecond(selctedMarker._Duration);
                var positionMS = 0;
                var totalDuartion = this.formatTime((durationMS + positionMS) / 10000000);
                this.markersDirectory.push(selctedMarker);
                for (var key in objs) {
                    if (!objs.hasOwnProperty(key)) continue;
                    var val = objs[key];
                    if (val instanceof Array) val.forEach(val => { this.markersobjects.push({ key, val, totalDuartion }); });
                    else this.markersobjects.push({ key, val, totalDuartion });
                }
            }
        }
        else {
            var durationMS = this.formatDurationInMiliSecond(selctedMarker._Duration);
            var positionMS = this.formatPoistionInMiliSecond(selctedMarker._Position);
            if (this.formatTime(this.video.currentTime) >= selctedMarker._Position) {
                var totalDuartion = this.formatTime((durationMS + positionMS) / 10000000);

                if (this.IsMarkerObjectExist(selctedMarker) == -1) {
                    for (var key in objs) {
                        if (!objs.hasOwnProperty(key)) continue;
                        var val = objs[key];

                        if (val instanceof Array) {
                            val.forEach(val => {
                                this.markersobjects.push({ key, val });
                            });
                        }
                        else {
                            this.markersDirectory.push(selctedMarker);
                            this.markersobjects.push({ key, val, totalDuartion });
                        }
                    }
                }
            }
        }
    }

    IsMarkerObjectExist(selctedMarker) {
        return this.markersDirectory.indexOf(selctedMarker)
    }

    formatPoistionInMiliSecond(pos) {
        if (pos == "00:00:00") {
            return 0;
        }
        else {
            var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
            return positionInMilliseconds;
        }
    }

    formatDurationInMiliSecond(dur) {
        if (dur != undefined) {
            if (dur.length == 16) {
                var durationInMilliseconds = Number(dur.slice(1, 2)) * 36000000000 + Number(dur.slice(4, 5)) * 60000000 + Number(dur.slice(7, 8)) * 10000000 + Number(dur.substr(-7));
                return durationInMilliseconds;
            }
            else {
                var durationInMilliseconds = Number(dur.slice(1, 2)) * 36000000000 + Number(dur.slice(4, 5)) * 60000000 + Number(dur.slice(7, 8)) * 10000000 + Number(dur.substr(-2)) * 100000;
                return durationInMilliseconds;
            }
        }
    }

    // markersObjects = []

    // loadMarkerObjects() {
    //     var interval = setInterval(() => {
    //         if (this.markers != undefined) {

    //             clearInterval(interval);

    //             this.markers.forEach(data => {
    //                 var objs = data['Marker.Objects'];

    //                 var objects = [];

    //                 for (var key in objs) {
    //                     // skip loop if the property is from prototype
    //                     if (!objs.hasOwnProperty(key)) continue;
    //                     var val = objs[key];

    //                     if (val instanceof Array) {
    //                         val.forEach(val => {
    //                             objects.push({ key, val });
    //                         });
    //                     }
    //                     else {
    //                         objects.push({ key, val });
    //                     }
    //                 }

    //                 this.markersObjects.push({ data, objects })

    //             });
    //             console.log(this.markersObjects);
    //         }
    //     }, 1);
    // }
    //Code for objects end
}
@Component({
    template: `
    <ion-list radio-group>
    <ion-item *ngFor="let view of views; let i = index">
    <ion-label>{{view._Title}}</ion-label>
    <ion-radio value="view" [checked]="view == currentView" (click)="changeView(view)"></ion-radio>
    </ion-item>
    </ion-list>
  `
})
export class CaptureViewsPopover {
    views = [];

    currentView: any;

    constructor(public viewCtrl: ViewController,
        private navParams: NavParams) {
    }

    ngOnInit() {
        console.log('Hello views list popover');
        if (this.navParams.data) {
            this.views = this.navParams.data.views;
            console.log(this.views);
            this.currentView = this.navParams.data.view;
        }
    }

    changeView(view) {
        this.viewCtrl.dismiss(view);
    }

}