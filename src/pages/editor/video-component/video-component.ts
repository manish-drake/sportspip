import { Component, Directive, ViewChild } from '@angular/core';
import { AlertController, ModalController } from 'ionic-angular';

@Component({
    selector: 'video-component',
    templateUrl: 'video-component.html'
})

export class VideoComponent {

    constructor(private alertCtrl: AlertController, private modalCtrl: ModalController) {

        this.volumeValue = 50;
        this.playPauseButtonIcon = "play";
        this.repeatColor = "light"
        this.volumeButtonIcon = "volume-up";
        this.timelinePosition = 0;

        this.loadVideo();
    }

    sliderValue: any=0;
    volumeValue: number;
    timelinePosition: any;
    timelineDuration: any;
    repeatColor: any;

    interval: any = null;

    viewBoxSize: any;

    loadVideo() {
        window.setTimeout(() => {
            var video = <HTMLVideoElement>document.getElementById("video");
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
            }, 1);
        }, 1)


    }

    formatTime(time) {
        var min = Math.floor(time / 60);
        var minutes = (min >= 10) ? min : "0" + min;
        var sec = Math.floor(time % 60);
        var seconds = (sec >= 10) ? sec : "0" + sec;
        return minutes + "." + seconds;
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

    onResize(event) { }

    markers = [];
    timeline: any;

    evaluateMarkerPosition(pos) {
        var markersContainerWidth = this.markersContainer.nativeElement.clientWidth;
        var factor = markersContainerWidth / this.timelineDuration;
        return pos * factor + 'px';
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
        var currentPosition = this.timelinePosition;
        var canAddMarker = this.checkPosition(currentPosition);
        if (canAddMarker) {
            this.markers.push({ position: currentPosition });
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
                if (position == marker.position)
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