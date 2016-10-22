import { Pipe,PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'sort'
// })
// export class SortPipe {
//   transform(array: Array<string>, args: string): Array<string> {
//     array.sort((a: any, b: any) => {
//       if (a < b) {
//         return -1;
//       } else if (a > b) {
//         return 1;
//       } else {
//         return 0;
//       }
//     });
//     return array;
//   }
// }

@Pipe({name: 'filter'})

export class OrderBy implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {  
        if (!items) return [];        
        return items.filter(it => it[field] == value);
    }
}