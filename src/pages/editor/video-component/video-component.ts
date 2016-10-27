import { Component, ViewChild, Input, ElementRef } from '@angular/core';

import { AlertController, ModalController, Platform } from 'ionic-angular';
declare var cordova: any;

@Component({
    selector: 'video-component',
    templateUrl: 'video-component.html'
})

export class VideoComponent {

    @Input() data: any;

    sliderValue: any = 0;
    timelinePosition: any;
    timelineDuration: any;
    repeatColor: any;
    playPauseButtonIcon: string;
    volumeButtonIcon: string;
    // volumeValue: number;

    viewBoxSize: any;

    constructor(private alertCtrl: AlertController, private modalCtrl: ModalController, private platform: Platform) {

        this.playPauseButtonIcon = "play";
        this.repeatColor = "inactive"
        this.timelinePosition = '00:00:00.00';
        // this.volumeValue = 50;
        this.volumeButtonIcon = "volume-up";
    }

    ngOnInit() { }

    @ViewChild('videoElement') videoElement: ElementRef;
    video: HTMLVideoElement;

    timelineInterval: any = null;

    ngAfterViewInit() {
        console.log(this.data);
        this.markers = this.data["Content"]["Capture"]["View.ChronoMarker"]["ChronoMarker"];
        this.loadObjects();
        this.loadMarkerObjects();

        this.video = this.videoElement.nativeElement;

        this.video.addEventListener('ended', () => {
            this.playPauseButtonIcon = 'play';
            window.clearInterval(this.timelineInterval);
        })

        window.setInterval(() => {
            this.timelineDuration = this.formatTime(this.video.duration);
            this.viewBoxSize = '0 0 ' + this.video.videoWidth + ' ' + this.video.videoHeight;
            this.evaluateMarkerPosition();
        }, 1);

        // var volFactor = this.volumeValue / 100;
        // this.video.nativeElement.volume = volFactor;
    }

    returnVidPath(filename) {
        // if (this.platform.is('cordova')) {
        //     return cordova.file.applicationStorageDirectory + filename;
        // }
        // else {
            return 'assets/' + filename;
        // }
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
            this.playPauseButtonIcon = 'pause';
            this.timelineInterval = window.setInterval(() => {

                var factor = (100000 / this.video.duration) * this.video.currentTime;
                this.sliderValue = factor;
                this.timelinePosition = this.formatTime(this.video.currentTime);
            }, 1);
        } else {
            this.video.pause();
            this.playPauseButtonIcon = 'play';
            window.clearInterval(this.timelineInterval);
        }
    }

    repeatVideo() {
        if (this.video.loop == false) {
            this.video.loop = true;
            this.repeatColor = 'primary';
        } else {
            this.video.loop = false;
            this.repeatColor = 'inactive';
        }
    }

    previousVideoFrame() {
        if (this.video.currentTime >= 0) {
            this.video.pause();
            this.playPauseButtonIcon = 'play';
            this.video.currentTime = this.video.currentTime - 0.1;
        }
    }

    nextVideoFrame() {
        if (this.video.currentTime <= this.video.duration) {
            this.video.pause();
            this.playPauseButtonIcon = 'play';
            this.video.currentTime = this.video.currentTime + 0.1;
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

    MuteVideo() {
        if (this.video.muted == false) {
            this.video.muted = true;
            this.volumeButtonIcon = "volume-off";
        } else {
            this.video.muted = false;
            this.volumeButtonIcon = "volume-up";
        }
    }

    // volumeValueChange(){
    //      var volFactor = this.volumeValue / 100;
    //      this.video.volume = volFactor;
    //      if (volFactor == 0) {
    //          this.volumeButtonIcon = "volume-off";
    //      } else {
    //          this.volumeButtonIcon = "volume-up";
    //      }
    // }

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

    addMarker() {
        var currentPosition = this.timelinePosition + '00000';
        var canAddMarker = this.checkPosition(currentPosition);
        if (canAddMarker) {
            var name = 'Marker ' + (this.markers.length + 1);
            this.markers.push({ _Duration: '00:00:03', _Name: name, _Position: currentPosition, _Speed: 1, _name: name });
            this.evaluateMarkerPosition();
            console.log(this.markers);
        }
        else {
            let alert = this.alertCtrl.create({
                title: 'Limit Reached',
                subTitle: 'Only 4 markers can be added on same position.',
                buttons: ['OK']
            });
            alert.present();
        }
    }

    checkPosition(position) {
        var samePosition: number = 0;
        if (this.markers.length > 3) {
            this.markers.forEach((marker) => {
                if (position == marker._Position)
                    samePosition++;
            });
            if (samePosition >= 4)
                return false;
            else
                return true;
        }
        else
            return true;
    }

    deleteMarker(i) {
        let confirm = this.alertCtrl.create({
            title: 'Delete Marker!',
            message: 'Do you realy want to delete marker?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => { }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.markers.forEach((marker, index) => {
                            if (i == index) {
                                this.markers.splice(index, 1);
                            }
                        });
                    }
                }
            ]
        });
        confirm.present();
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
        var objs = this.data["Content"]["Capture"]["Marker"]["Marker.Objects"];

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
        var interval = window.setInterval(() => {
            if (this.markers != undefined) {

                window.clearInterval(interval);

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