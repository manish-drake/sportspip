import { Directive ,ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appSportsCheck]'
})
export class SportsCheckDirective {

  constructor(public viewContainerRef : ViewContainerRef) { }

}
