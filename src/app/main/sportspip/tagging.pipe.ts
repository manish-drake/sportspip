import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagging'
})
export class TaggingPipe implements PipeTransform {

  transform(value: any, args: any[]): any {
    return null;
  }

}
