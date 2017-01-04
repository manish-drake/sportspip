import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { ICommand } from '../../Contracts/ICommand'

@Directive({
    selector: '[command]'
})
export class CommandDirective {
    @Input() command: ICommand;
    @Input() cmdArgs:any;
    constructor(el: ElementRef) {

    }

    @HostListener('click') onClick() {
        this.command.run(this.cmdArgs);
    }
}