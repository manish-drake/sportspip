import { Component, Input } from '@angular/core';

@Component({
  selector: 'canvas-component',
  templateUrl: 'canvas-component.html'
})

export class CanvasComponent {

  @Input() data: string;

  objects: any;

  constructor() {
    window.setTimeout(() => {
      console.log(this.data);

      this.objects = this.data["Content"]["PIP"]["PIP.Objects"];
      console.log(this.objects);
    }, 1);
  }

  ionViewDidLoad() {

  }

}
