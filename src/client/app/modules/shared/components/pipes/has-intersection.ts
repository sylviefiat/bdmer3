import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Pipe({ name: 'bcHasIntersection' })
export class HasIntersection implements PipeTransform {
  transform(array: any[], item: any) {
  	return array && ((item.code && array.indexOf(item.code) > 0) || (item && array.indexOf(item) > 0));
  }
}
