import { PipeTransform } from '@angular/core';
export declare class GroupBy implements PipeTransform {
    transform(value: Array<any>, field: string): Array<any>;
}
