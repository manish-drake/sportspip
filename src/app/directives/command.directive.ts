import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { ICommand } from '../../Contracts/ICommand'

@Directive({
    selector: '[command]'
})
export class CommandDirective {
    @Input() command: ICommand;
    constructor(el: ElementRef) {

    }

    @HostListener('click') onClick() {
        this.command.run();
    }
}