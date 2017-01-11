import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { VideoEditor } from 'ionic-native';

import { Storage } from '../../../Services/Factory/Storage';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { AlertControllers } from '../../../Services/Alerts';
import { AlertController, ModalController, Platform, Events } from 'ionic-angular';
import { Logger } from '../../../logging/logger';

@Component({
    selector: 'video-component',
    templateUrl: 'video-component.html'
})

export class VideoComponent {

    @Input() view: any;
    @Input() viewindex: any;

    @ViewChild('video') videoElement: ElementRef;

    rootDir: String;

    constructor(private alertCtrls: AlertControllers,
        private storage: Storage,
        private storageFactory: StorageFactory,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private platform: Platform,
        private events: Events,
        private _logger: Logger) {
        this.rootDir = this.storage.externalRootDirectory();
        this.timelinePosition = this.formatTime(0);
    }

    sliderValue: any = 0;
    timelinePosition: any;
    timelineDuration: any;
    repeatColor: any = "inactive";
    playPauseButtonIcon: string = "play";
    isVideoComponentVisible: boolean = true;
    isErrorVisible: boolean = false;
    markersDirectory = [];

    viewBoxSize: any;
    markersobjects = [];
    video: HTMLVideoElement;
    markers = [];

    ngAfterViewInit() {
        this._logger.Debug('Video-component Loaded');
        this.video = this.videoElement.nativeElement;

        this.video.addEventListener('loadedmetadata', () => {
            this.OnVideoMatadataLoad();
        });

        this.video.addEventListener('ended', () => {
            this.OnVideoEnded();
        });

        this.video.addEventListener('error', (error) => {
            this.OnVideoError(error);
        });

        this.events.subscribe('viewoutoffocus', () => {
            if (!this.video.paused) {
                this.playPause();
            }
        });
    }

    OnVideoMatadataLoad() {
        this._logger.Debug('OnVideoMatadataLoad');
        this.sliderValue = 0;
        this.timelinePosition = this.formatTime(0);
        this.timelineDuration = this.formatTime(0);
        this.repeatColor = "inactive";
        this.playPauseButtonIcon = "play";
        this.isVideoComponentVisible = true;
        this.isErrorVisible = false;
        this.markersDirectory = [];
        this.viewBoxSize = "0 0 0 0";
        this.markersobjects = [];
        this.markers = [];

        this.loadObjects();/*$Candidate for refactoring$*///Consider removing canvas for this component
        this.LoadMarkers();/*$Candidate for refactoring$*///Consider removing timeline from this component

        this.video.currentTime = .1;
        this.video.setAttribute('preload', "auto");
        this.video.play();
        this.video.pause();
        VideoEditor.getVideoInfo({ fileUri: this.video.currentSrc })
            .then(res => {
                this.timelineDuration = this.formatTime(res.duration);
                this._logger.Debug("View " + (this.viewindex + 1) + '; Video Info:: '
                    + "Duration: " + this.formatTime(res.duration) +
                    ", Source: " + this.video.currentSrc +
                    ", Resolution: " + res.width + "*" + res.height +
                    ", Bitrate: " + res.bitrate +
                    ", Size: " + res.size
                );
            })
            .catch(err => this._logger.Error("Error getting video info: ", err));

        this.viewBoxSize = '0 0 ' + this.video.videoWidth + ' ' + this.video.videoHeight;
        this.evaluateMarkerPosition();
    }

    OnVideoEnded() {
        var val = this.markers.find(x => x.checked == true);
        if (val == undefined) {
            this.playPauseButtonIcon = 'play';
            clearInterval(this.timelineInterval);
        }
    }

    public errormessage: any;

    OnVideoError(error) {
        console.log('Error loading video: ' + JSON.stringify(error));

        var filePath = this.video.currentSrc;
        var dirpath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        this.storageFactory.CheckFile(dirpath, fileName)
            .then(success => {
                this.isErrorVisible = true;
                this._logger.Error("View " + (this.viewindex + 1) + ': Error loading video: ', this.videoErrorHandling(this.video.error.code));
                this.errormessage = this.videoErrorHandling(this.video.error.code);
            })
            .catch(err => {
                this.isVideoComponentVisible = false;
                this.isErrorVisible = true;
                this._logger.Error("View " + (this.viewindex + 1) + ': Video file not exists in the desired directory: ', error);
                this.errormessage = "Video file not found";
            });
    }

    videoErrorHandling(errornumber) {
        var error;
        switch (errornumber) {
            case 1:
                error = "MEDIA_ERR_ABORTED - fetching process aborted by user";
                break;
            case 2:
                error = "MEDIA_ERR_NETWORK - error occurred when downloading";
                break;
            case 3:
                error = "MEDIA_ERR_DECODE - error occurred when decoding";
                break;
            case 4:
                error = "MEDIA_ERR_SRC_NOT_SUPPORTED - audio/video not supported";
                break;
            default:
                error = "An unknown error occured"
        }
        return error;
    }

    LoadMarkers() {
        var chronoMarker = this.view["Content"]["Capture"]["View.ChronoMarker"]["ChronoMarker"];
        if (chronoMarker != undefined) {
            if (chronoMarker instanceof Array) {
                chronoMarker.forEach(marker => {
                    this.markers.push(marker);
                });
            }
            else this.markers.push(chronoMarker);
            this.evaluateMarkerPosition();
        }
    }

    timelineInterval: any;

    playPause() {
        if (this.video.paused == true) {
            this.timelineInterval = setInterval(() => {
                var factor = (100000 / this.video.duration) * this.video.currentTime;
                this.sliderValue = factor;
                this.timelinePosition = this.formatTime(this.video.currentTime);
                if (this.timelinePosition == this.timelineDuration) {
                    this.playPauseButtonIcon = 'play';
                }
                this.PlayMarker();
                this.PlayStoryBoard();
            }, 1 / 60);
            this.playPauseButtonIcon = 'pause';
            this.video.play();
            if (this.formatTime(this.video.currentTime) == this.timelineDuration) {
                this.markersobjects = [];
                this.markersDirectory = [];
            }
        } else {
            this.playPauseButtonIcon = 'play';
            clearInterval(this.timelineInterval);
            this.video.pause();
        }
    }

    sliderValueChange() {
        this.timelinePosition = this.formatTime(this.video.currentTime);
        var factor = this.video.duration * (this.sliderValue / 100000);
        this.video.currentTime = factor;
        this.timelinePosition = this.formatTime(factor);
        this.PlayStoryBoard();
    }

    returnVidPath(filename) {
        if (this.platform.is('cordova')) {
            return this.rootDir + "SportsPIP/Video/" + filename;
        }
        else {
            return 'assets/' + filename;
        }
    }

    returnImagePath(name) {
        if (this.platform.is('cordova')) {
            return this.rootDir + "SportsPIP/Picture/" + name;
        }
        else {
            return 'assets/sample.jpg';
        }
    }

    returnInkPath(name) {
        if (this.platform.is('cordova')) {
            return this.rootDir + "SportsPIP/Picture/" + name + ".gif";
        }
        else {
            return 'assets/inksample.gif';
        }
    }

    formatPoistionInMiliSecond(pos) {
        if (pos == "00:00:00") pos = "00:00:00.000000";
        var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
        return positionInMilliseconds;

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
        if (this.video.currentTime > 0) {
            if (!this.video.paused) { this.playPause() }
            this.video.currentTime = this.video.currentTime - 0.1;
            var factor = (100000 / this.video.duration) * this.video.currentTime;
            this.sliderValue = factor;
            this.timelinePosition = this.formatTime(this.video.currentTime);
            this.PlayMarker();
            this.PlayStoryBoard();
        }
    }

    nextVideoFrame() {
        if (this.video.currentTime < this.video.duration) {
            if (!this.video.paused) { this.playPause() }
            this.video.currentTime = this.video.currentTime + 0.1;

            var factor = (100000 / this.video.duration) * this.video.currentTime;
            this.sliderValue = factor;
            this.timelinePosition = this.formatTime(this.video.currentTime);
            this.PlayMarker();
            this.PlayStoryBoard();
        }
        else {
            this.video.currentTime = 0;
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

    PlayMarker() {
        var val = this.markers.find(x => x.checked == true)
        if (val != undefined) {
            var positionMS = this.formatPoistionInMiliSecond(val._Position);
            var durationMS = this.formatDurationInMiliSecond(val._Duration);

            var endMarkerDur = durationMS + positionMS;
            var endPlayDur = this.formatTime(endMarkerDur / 10000000);

            var fp = positionMS / 10000000;

            if (this.formatTime(this.video.currentTime) >= endPlayDur) {
                this.video.pause();
                this.video.currentTime = fp;
                this.video.play();
                this.playPauseButtonIcon = "pause";
            }
        }
    }

    index = 0;

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

    // Code for Markers starts

    @ViewChild('markersContainer') markersContainer;

    onResize(event) { this.evaluateMarkerPosition(); }

    evaluateMarkerPosition() {
        var interval = setInterval(() => {
            if (this.markers != undefined) {
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
            }
        }, 1 / 60)
    }

    updateSelection(i, isSelect) {
        this.markers.forEach((marker, index) => {
            if (i != index) {
                marker.checked = false;
                // this.playPauseButtonIcon = 'play';
                // this.video.pause();
                // clearInterval(this.timelineInterval);
            }
            else {
                if (isSelect) {
                    marker.checked = false;
                }
                else {
                    // this.video.pause();
                    // this.playPauseButtonIcon = 'play';
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

    addMarker() {
        console.log("Add Marker..");
        var currentPosition = this.timelinePosition + '00000';
        if (this.markers == undefined) {
            console.log("markers are undefined");
            this.markers = [];
            var name = 'Marker 1';
            this.markers.push({ _Duration: '00:00:03', _Name: name, _Position: currentPosition, _Speed: 1, _name: name });
            this.saveMarkers();
            this.evaluateMarkerPosition();
            console.log("..Marker Added");
        }
        else {
            var canAddMarker = this.canAddMarker(currentPosition);
            if (canAddMarker) {
                var name = 'Marker ' + (this.markers.length + 1);
                this.markers.push({ _Duration: '00:00:03', _Name: name, _Position: currentPosition, _Speed: 1, _name: name });
                this.evaluateMarkerPosition();
                console.log("..Marker Added");
                this.saveMarkers();
            }
            else { this.alertCtrls.BasicAlert('Limit Reached', 'Only 4 markers can be added on same position.'); }
        }
    }

    saveMarkers() {
        console.log("Saving markers..");
        var ChronoMarker = { ChronoMarker: this.markers };
        this.view["Content"]["Capture"]["View.ChronoMarker"] = ChronoMarker;
    }

    canAddMarker(position) {
        var samePosition: number = 0;
        if (this.markers.length > 3) {
            console.log("MoreThan 4 markers present");
            this.markers.forEach((marker) => {
                if (position == marker._Position)
                    samePosition++;
            });
            if (samePosition >= 4) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
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
        var objs = this.view["Content"]["Capture"]["Marker"]["Marker.Objects"];
        if (objs != undefined) {
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

        }
    }
    //Code for objects end
}