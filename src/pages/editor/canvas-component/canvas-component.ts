import { Component, Input } from '@angular/core';

@Component({
  selector: 'canvas-component',
  templateUrl: 'canvas-component.html'
})

export class CanvasComponent {

  @Input() view: any;
  maxDuration: any;
  constructor() { }

  objects = [];

  ngOnInit() {
    this.maxDuration = "00:00:00";
    console.log(this.view);

    var objs = this.view["Content"]["PIP"]["PIP.Objects"];

    for (var key in objs) {
      // skip loop if the property is from prototype
      if (!objs.hasOwnProperty(key)) continue;
      var val = objs[key];
      //for maximum duration
      var objDuration = val.Behaviors;
      if (objDuration) {
        var duration = objDuration.Span._Duration;
        console.log(duration);
        if (duration > this.maxDuration) this.maxDuration = duration;
        console.log(this.maxDuration);
      }

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
}

