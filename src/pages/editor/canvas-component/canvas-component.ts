import { Component, Input } from '@angular/core';

@Component({
  selector: 'canvas-component',
  templateUrl: 'canvas-component.html'
})

export class CanvasComponent {

  @Input() data: any;

  constructor() {}

  objects = [];

  ngOnInit() {
    console.log(this.data);

    var objs = this.data["Content"]["PIP"]["PIP.Objects"];

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

  clrCvt(color) {
    return '#' + color.slice(3, 9);
  }

  sum(a, b) {
    return Number(a) + Number(b);
  }
}
