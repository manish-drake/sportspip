import { Pipe, PipeTransform } from '@angular/core';
import { Logger } from '../logging/logger';

@Pipe({ name: 'groupBy' })

export class GroupBy implements PipeTransform {

    constructor(private _logger: Logger) { }
    transform(value: Array<any>, field: string): Array<any> {

        const groupedObj = value.reduce((prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(key => { return { key, value: groupedObj[key] } });

    }
}