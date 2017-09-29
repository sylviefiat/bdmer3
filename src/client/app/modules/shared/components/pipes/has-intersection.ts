import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Pipe({ name: 'bcHasIntersection' })
export class HasIntersection implements PipeTransform {
  transform(array: any[], item: any) {
  	return array && array.indexOf(item.code) > 0;
  }
}
