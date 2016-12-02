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
  duration: any;
  isTimelineAvailable: boolean;

  constructor() {
    this.timelinePosition = "00:00:00:00";
    this.playPauseButtonIcon = "play";
    this.repeatColor = "inactive";
    this.volumeButtonIcon = "volume-up";
    this.isTimelineAvailable = false;
  }

  objects = [];
  objduration: any;
  timelineInterval: any = null;
  objs: any;
  unlinkObjList = [];
  objDirectory = [];

  ngAfterViewInit() {
    // this.isTimelineAvailable = true;
    this.timelineDuration = "00:00:00.00";
    this.loadObjects()
  }

  loadObjects() {
    var objs = this.view["Content"]["PIP"]["PIP.Objects"];
    for (var key in objs) {
      // skip loop if the property is from prototype
      if (!objs.hasOwnProperty(key)) continue;
      var keyVal = objs[key];
      if (keyVal instanceof Array) {
        keyVal.forEach(val => {
          var objBehaviors = val.Behaviors;
          if (objBehaviors != undefined) {
            this.returnMaxDuration(objBehaviors);
          }
        });
      }
    }
    this.PlayStoryBoard();
  }


  returnMaxDuration(objBehaviors) {
    // this.isTimelineAvailable = true;
    if (objBehaviors.Span._Duration > this.timelineDuration) { this.timelineDuration = objBehaviors.Span._Duration; }
    var durationInMS = (this.formatDurationInMiliSecond(this.timelineDuration)) / 10000000;
    this.duration = durationInMS;
    this.timelineDuration = this.formatTime(this.duration);
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
    if (this.timelinePosition == this.timelineDuration) {
      this.objects = [];
      this.objDirectory = [];
    }
    this.PlayStoryBoard();
    this.RemoveObjects();
  }

  formatPoistionInMiliSecond(pos) {
    var positionInMilliseconds = Number(pos.slice(1, 2)) * 36000000000 + Number(pos.slice(4, 5)) * 60000000 + Number(pos.slice(7, 8)) * 10000000 + Number(pos.substr(-7));
    return positionInMilliseconds;
  }

  formatDurationInMiliSecond(dur) {
    if (dur != undefined) {
      var durationInMilliseconds = Number(dur.slice(1, 2)) * 36000000000 + Number(dur.slice(4, 5)) * 60000000 + Number(dur.slice(7, 8)) * 10000000 + Number(dur.substr(-2)) * 100000;
      return durationInMilliseconds;
    }
  }

  playPause() {

    if (this.playPauseButtonIcon == 'play') {
      this.playPauseButtonIcon = 'pause';

      if (this.timelinePosition == this.timelineDuration) {
        this.sliderValue = 0;
        this.objects = [];
        this.objDirectory = []
      }

      this.timelineInterval = setInterval(() => {

        this.sliderValue = this.sliderValue + 5;
        var factor = this.duration * (this.sliderValue / 10000);
        this.timelinePosition = this.formatTime(factor);

        this.PlayStoryBoard();
        this.RemoveObjects();
        this.ClearInterval();
      }, 1 / 60);
    }
    else {
      this.playPauseButtonIcon = 'play';
      clearInterval(this.timelineInterval);
    }
  }

  PlayStoryBoard() {
    var objs = this.view["Content"]["PIP"]["PIP.Objects"];
    for (var key in objs) {
      // skip loop if the property is from prototype
      var val = objs[key];
      if (!objs.hasOwnProperty(key)) continue;

      if (val instanceof Array) {
        console.log()
        val.forEach(val => {
          var objbeh = val.Behaviors.Span;
          if (this.IsObjectExist(val) == -1) {
            if (objbeh._Position == "00:00:00") {
              this.objDirectory.push(val);
              this.objects.push({ key, val });
            } else {
              var positionInMS = (this.formatPoistionInMiliSecond(objbeh._Position)) / 10000000;
              if (this.formatTime(positionInMS) == this.timelinePosition) {
                this.objDirectory.push(val);
                this.objects.push({ key, val });
              }
            }

          }
        });
      }
      else if (val.Behaviors.Span != undefined) {
        if (val.Behaviors.Span._Position == "00:00:00") {
          if (this.IsObjectExist(val) == -1) {
            this.objDirectory.push(val);
            this.objects.push({ key, val });
          }
        }
      }
      else if (val.Behaviors.Span == undefined) {
        if (this.IsObjectExist(val) == -1) {
          this.objDirectory.push(val);
          this.objects.push({ key, val });
        }
      }
    }
  }

  IsObjectExist(obj) {
    return this.objDirectory.indexOf(obj)
  }

  returnTotalDuration(objBehaviors) {
    if (objBehaviors.Span != undefined) {
      var durationInMS = this.formatDurationInMiliSecond(objBehaviors.Span._Duration);
      var positionInMS = this.formatPoistionInMiliSecond(objBehaviors.Span._Position);
      var totalDur = (durationInMS + positionInMS) / 10000000;
      return totalDur
    }
  }

  RemoveObjects() {
    var objects = this.objects.find(x => this.formatTime(this.returnTotalDuration(x.val.Behaviors)) == this.timelinePosition)
    if (objects != undefined) {
      var obj = this.objects.indexOf(objects);
      this.objects.splice(obj, 1);
    }

  }

  ClearInterval() {
    if (this.timelinePosition == this.timelineDuration) {
      this.playPauseButtonIcon = 'play';
      clearInterval(this.timelineInterval);
    }
  }
}
