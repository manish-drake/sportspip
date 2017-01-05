import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { ICommand } from '../../Contracts/ICommand'

@Directive({
    selector: '[command]'
})
export class CommandDirective {
    @Input() usePress: boolean;
    @Input() command: ICommand;
    @Input() cmdArgs: any;
    constructor(el: ElementRef) {

    }

    @HostListener('click') onClick() {
        if (!this.usePress)
            this.command.run(this.cmdArgs);
    }

    @HostListener('press') onPress() {
        if (this.usePress)
            this.command.run(this.cmdArgs);
    }
}