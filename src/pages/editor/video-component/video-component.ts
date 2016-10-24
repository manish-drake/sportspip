import { Component, ViewChild, Input } from '@angular/core';
import { AlertController, ModalController } from 'ionic-angular';

@Component({
    selector: 'video-component',
    templateUrl: 'video-component.html'
})

export class VideoComponent {

    @ViewChild('video') video;

    @Input() data: any;

    objects = [];

    markersObjects = []

    sliderValue: any = 0;
    volumeValue: number;
    timelinePosition: any;
    timelineDuration: any;
    repeatColor: any;

    interval: any = null;

    viewBoxSize: any;

    constructor(private alertCtrl: AlertController, private modalCtrl: ModalController) {

        this.volumeValue = 50;
        this.playPauseButtonIcon = "play";
        this.repeatColor = "light"
        this.volumeButtonIcon = "volume-up";
        this.timelinePosition = 0;

        this.loadVideo();

        //Code for objects starts
        window.setTimeout(() => {
            console.log(this.data);

            this.markers = this.data["Content"]["Capture"]["View.ChronoMarker"]["ChronoMarker"];

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

        }, 1);
        //Code for objects end
    }

    //Code for objects starts
    clrCvt(color) {
        return '#' + color.slice(3, 9);
    }

    sum(a, b) {
        return Number(a) + Number(b);
    }
    //Code for objects end

    returnVidPath(filename) {
        return 'assets/' + filename;
    }

    loadVideo() {
        window.setTimeout(() => {

            // var video = <HTMLVideoElement>document.getElementById("video");
            var video = this.video.nativeElement;
            var volFactor = this.volumeValue / 100;
            video.volume = volFactor;
            this.viewBoxSize = '0 0 ' + video.videoWidth + ' ' + video.videoHeight;

            video.addEventListener('ended', () => {
                this.playPauseButtonIcon = 'play';
            })

            this.interval = window.setInterval(() => {
                var factor = (100000 / video.duration) * video.currentTime;
                this.sliderValue = factor;
                this.timelinePosition = this.formatTime(video.currentTime);
                this.timelineDuration = this.formatTime(video.duration);
                this.evaluateMarkerPosition();
            }, 1);
        }, 100);

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
    playPauseButtonIcon: string;
    volumeButtonIcon: string;

    captureController(state) {
        var video = <HTMLVideoElement>document.getElementById("video");
        switch (state) {
            case 'sliderValueChange':
                var factor = video.duration * (this.sliderValue / 100000);
                video.currentTime = factor;
                break;
            case 'playPause':
                if (video.paused == true) {
                    video.play();
                    this.playPauseButtonIcon = 'pause';
                } else {
                    video.pause();
                    this.playPauseButtonIcon = 'play';
                }
                break;
            case 'repeatVideo':
                if (video.loop == true) {
                    video.loop = false;
                    this.repeatColor = 'inactive';
                } else {
                    video.loop = true;
                    this.repeatColor = 'light';
                }
                break;
            case 'previousVideoFrame':
                if (video.currentTime >= 0) {
                    video.pause();
                    this.playPauseButtonIcon = 'play';
                    video.currentTime = video.currentTime - 0.1;
                }
                break;
            case 'nextVideoFrame':
                if (video.currentTime <= video.duration) {
                    video.pause();
                    this.playPauseButtonIcon = 'play';
                    video.currentTime = video.currentTime + 0.1;
                }
                break;
            case 'playbackRateVideo':
                var speed = video.playbackRate;
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

                video.playbackRate = speed;
                break;
            case 'volumeValueChange':
                var volFactor = this.volumeValue / 100;
                video.volume = volFactor;
                if (volFactor == 0) {
                    this.volumeButtonIcon = "volume-off";
                } else {
                    this.volumeButtonIcon = "volume-up";
                }
                break;
            case 'MuteVideo':
                if (video.muted == false) {
                    video.muted = true;
                    this.volumeButtonIcon = "volume-off";
                } else {
                    video.muted = false;
                    this.volumeButtonIcon = "volume-up";
                }
                break;
        }
    }

    // Code for Markers starts
    @ViewChild('markersContainer') markersContainer;

    onResize(event) { this.evaluateMarkerPosition(); }

    markers = [];

    evaluateMarkerPosition() {
        var markersContainerWidth = this.markersContainer.nativeElement.clientWidth;
        var durationInMilliseconds = this.stringToMilliseconds(this.timelineDuration);
        var factor = markersContainerWidth / durationInMilliseconds;

        this.markers.forEach(marker => {
            var pos = marker.Position;
            var positionInMilliseconds = this.stringToMilliseconds(pos);
            marker.Left = positionInMilliseconds * factor + 'px';
        });

        // return positionInMilliseconds * factor + 'px';
    }

    stringToMilliseconds(str) {
        return Number(str.slice(1, 2)) * 36000000000 + Number(str.slice(4, 5)) * 60000000 + Number(str.slice(7, 8)) * 10000000 + Number(str.substr(-2)) * 100000;
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
            this.markers.push({ Duration: '00:00:03', Name: name, Position: currentPosition, Speed: 1, name: name });
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
                if (position == marker.Position)
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
}