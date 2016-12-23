import { Pipe, PipeTransform } from '@angular/core';
import { Logger } from '../logging/logger';

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

@Pipe({ name: 'filter'})

export class OrderBy implements PipeTransform {
    constructor(private _logger: Logger) { }
    transform(items: any[], field: string, value: string): any[] {
        this._logger.Debug('Transform by order..');
        try {
            if (!items) return [];
            return items.filter(it => it[field] == value);
        }
        catch (err) {
            this._logger.Error('Error, transforming by order: ', JSON.stringify(err));
        }
    }
}