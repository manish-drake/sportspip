import { Component, Input } from '@angular/core';
@Component({
  selector: 'canvas-component',
  templateUrl: 'canvas-component.html'
})

export class CanvasComponent {

  @Input() view: any;
  playPauseButtonIcon: string;
  volumeButtonIcon: string;
  repeatColor: any;
  timelineDuration: any;
  timelinePosition: any;
  sliderValue: any = 0;
  objPostion: any;
  duration: any;

  constructor() {
    this.timelinePosition = "00:00:00.00";
    this.playPauseButtonIcon = "play";
    this.repeatColor = "inactive";
    this.volumeButtonIcon = "volume-up";
  }

  objects = [];
  objduration: any;
  timelineInterval: any = null;

  ngOnInit() {
    this.timelineDuration = "00:00:00:00";
    console.log(this.view);

    var objs = this.view["Content"]["PIP"]["PIP.Objects"];

    for (var key in objs) {
      // skip loop if the property is from prototype
      if (!objs.hasOwnProperty(key)) continue;
      var val = objs[key];
      //for maximum duration
      var objBehaviors = val.Behaviors;
      if (objBehaviors != undefined) {
        this.objduration = objBehaviors.Span._Duration;
        this.objPostion = objBehaviors.Span._Position;
        if (this.objduration > this.timelineDuration) { this.timelineDuration = this.objduration; }
      }
      var durationInMilliseconds = (Number(this.timelineDuration.slice(1, 2)) * 36000000000 + Number(this.timelineDuration.slice(4, 5)) * 60000000 + Number(this.timelineDuration.slice(7, 8)) * 10000000 + Number(this.timelineDuration.substr(-2)) * 100000) / 10000000;
      this.duration = durationInMilliseconds;
      this.timelineDuration = this.formatTime(this.duration);

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

  clrCvt(color) {
    return '#' + color.slice(3, 9);
  }

  sum(a, b) {
    return Number(a) + Number(b);
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
    var factor = this.duration * (this.sliderValue / 10000);
    this.timelinePosition = this.formatTime(factor);
  }
  formatPoistionInMiliSecond(pos) {
    var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
    return positionInMilliseconds;
  }

  formatDurationInMiliSecond(dur) {
    var durationInMilliseconds = Number(dur.slice(1, 2)) * 36000000000 + Number(dur.slice(4, 5)) * 60000000 + Number(dur.slice(7, 8)) * 10000000 + Number(dur.substr(-2)) * 100000;
    return durationInMilliseconds;
  }

  playPause() {
    if (this.playPauseButtonIcon == 'pause') {
      this.playPauseButtonIcon = 'play';
      clearInterval(this.timelineInterval);
    } else {
      this.playPauseButtonIcon = 'pause';
      var delay = 1 / 60;
      setInterval(() => {
        console.log("sfdf");
        console.log(this.formatDurationInMiliSecond(this.timelineDuration));
        console.log(this.formatPoistionInMiliSecond(this.timelinePosition));
        // var factor = (100000 / this.formatDurationInMiliSecond(this.duration) / 100000) * this.formatPoistionInMiliSecond(this.timelinePosition) / 100000;
        // this.sliderValue = factor;
        // this.timelinePosition = this.formatTime(this.sliderValue);
      }, delay);
      clearInterval(this.timelineInterval);
    }
  }
}