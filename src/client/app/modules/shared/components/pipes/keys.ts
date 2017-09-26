import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bcKeys' })
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
  	console.log(value);
  	console.log(args);
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}