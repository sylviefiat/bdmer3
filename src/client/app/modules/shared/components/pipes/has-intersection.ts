import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bcHasIntersection' })
export class HasIntersection implements PipeTransform {
  transform(array: any[], item: any, selected?: any) {
    return array && (item !== selected) && ((item.code && array.indexOf(item.code) >= 0) || (array.indexOf(item) >= 0));
  }
}
