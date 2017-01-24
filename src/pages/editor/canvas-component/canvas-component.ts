import { Component, Input } from '@angular/core';
import { Storage } from '../../../Services/Factory/Storage';
import { Platform, Events } from 'ionic-angular'
import { Utils } from '../../../Services/common/utils';

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
  isTimelineAvailable: boolean = false;
  rootDir: any;
  constructor(private platform: Platform, private events: Events, private storage: Storage, private utils: Utils) {
    this.timelinePosition = "00:00:00:00";
    this.playPauseButtonIcon = "play";
    this.repeatColor = "inactive";
    this.volumeButtonIcon = "volume-up";

    this.storage.externalRootDirectory().then((res) => {
      this.rootDir = res;
    })
  }

  objects = [];
  objduration: any;
  timelineInterval: any = null;
  objs: any;
  unlinkObjList = [];
  objDirectory = [];

  ngOnInit() {
    this.timelineDuration = "00:00:00.00";
    this.PlayStoryBoard();

    this.events.subscribe('viewoutoffocus', () => {
      if (this.playPauseButtonIcon == 'pause') {
        this.playPause();
      }
    });
  }

  returnImagePath(name) {/*$Candidate for refactoring$*///Storage code lurking here!!
    if (this.platform.is('cordova')) {
      return this.rootDir + "SportsPIP/Picture" + name;
    }
    else {
      return 'assets/sample.jpg';
    }
  }

  returnInkPath(name) {/*$Candidate for refactoring$*///Storage code lurking here
    if (this.platform.is('cordova')) {
      return this.rootDir + "SportsPIP/Picture" + name + ".gif";
    }
    else {
      return 'assets/inksample.gif';
    }
  }

  sliderValueChange() {
    var factor = this.duration * (this.sliderValue / 10000);/*$Candidate for refactoring$*///make a const out of the 10000 value
    this.timelinePosition = this.formatTime(factor);
    if (this.timelinePosition == this.timelineDuration) {
      this.objects = [];
      this.objDirectory = [];
    }
    this.PlayStoryBoard();
    this.RemoveObjects();
  }

  clrCvt(color) {/*$Candidate for refactoring$*///Is there anything hardcoded here?
    return '#' + color.slice(3, 9);
  }

  sum(a, b) {/*$Candidate for refactoring$*///seriously?!?!
    return Number(a) + Number(b);
  }

  formatTime(time) {/*$Candidate for refactoring$*///Move to /services/common/utils please
    return this.utils.formatTime(time);
  }

 static formatPoistionInMiliSecond(pos) {
    return Utils.formatPoistionInMiliSecond(pos);
  }

 static formatDurationInMiliSecond(dur) {
    return Utils.formatDurationInMiliSecond(dur);
  }

  playPause() {/*$Candidate for refactoring$*///move to actions - I know the repeated use of 'this' will trouble you, but then that is what we have to avoid
    if (this.playPauseButtonIcon == 'play') {
      this.playPauseButtonIcon = 'pause';

      if (this.timelinePosition == this.timelineDuration) {
        this.sliderValue = 0;
        this.objects = [];
        this.objDirectory = []
      }

      this.timelineInterval = setInterval(() => {
        this.sliderValue = this.sliderValue + 50;
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

  PlayStoryBoard() {/*$Candidate for refactoring$*///smelling code duplication. The load object function looks similar to this function. Why not refactor both??
    var objs = this.view["Content"]["PIP"]["PIP.Objects"];
    for (var key in objs) {
      // skip loop if the property is from prototype
      var val = objs[key];
      if (!objs.hasOwnProperty(key)) continue;

      if (val instanceof Array) {
        val.forEach(val => {
          if (val.Behaviors.Span != undefined) {
            this.setMaxDuration(val.Behaviors);
            var objbeh = val.Behaviors.Span;

            if (this.IsObjectExist(val) == -1) {
              if (objbeh._Position == "00:00:00") {
                this.addObject(val, key);
              } else {
                var positionInMS = (CanvasComponent.formatPoistionInMiliSecond(objbeh._Position)) / 10000000;
                if (this.timelinePosition >= this.formatTime(positionInMS)) {
                  this.addObject(val, key);
                }
              }

            }
          }
        });
      }
      else
        if (val.Behaviors.Span != undefined) {
          this.setMaxDuration(val.Behaviors);
          if (this.IsObjectExist(val) == -1) {
            if (val.Behaviors.Span._Position == "00:00:00") {
              this.addObject(val, key);
            }
          }
        }
        else if (val.Behaviors.Span == undefined) {
          if (this.IsObjectExist(val) == -1) {
            this.addObject(val, key);
          }
        }
    }
  }

  addObject(val, key) {
    this.objDirectory.push(val);
    this.objects.push({ key, val });
  }

  IsObjectExist(obj) {
    return this.objDirectory.indexOf(obj);/*$Candidate for refactoring$*///please observe that you are pushing objects in this array from multiple places (shift+F12 on objDirectory) and there can be duplicate items in this array. No condition to check that. so the function can return bad value.
  }

  setMaxDuration(objBehaviors) {/*$Candidate for refactoring$*///The name suggests it will return MaxDuration, instead it is blatantly modifying class fields. Bad!
    if (!this.isTimelineAvailable) this.isTimelineAvailable = true;
    if (objBehaviors.Span._Duration >= this.timelineDuration) { this.timelineDuration = objBehaviors.Span._Duration; }
    var durationInMS = (CanvasComponent.formatDurationInMiliSecond(this.timelineDuration)) / 10000000;
    this.duration = durationInMS;
  }

 static returnTotalDuration(objBehaviors) {/*$Candidate for refactoring$*///consider making the function static
    if (objBehaviors.Span != undefined) {
      var durationInMS = this.formatDurationInMiliSecond(objBehaviors.Span._Duration);
      var positionInMS = this.formatPoistionInMiliSecond(objBehaviors.Span._Position);
      var totalDur = (durationInMS + positionInMS) / 10000000;/*$Candidate for refactoring$*///make a const out of big numbers or a multiple of any other const
      return totalDur;
    }
    return null;
  }

  RemoveObjects() {
    var object = this.objects.find(x => this.timelinePosition >= this.formatTime(CanvasComponent.returnTotalDuration(x.val.Behaviors)))
    if (object != undefined) {
      console.log(object);
      var obj = this.objects.indexOf(object);
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
