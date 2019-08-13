import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFormater'
})
export class ArrayFormaterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let str = '';
    if (value !== undefined) {
      str = Array.prototype.map.call(value, s => s.name.charAt(0).toUpperCase() + s.name.slice(1)).toString();
      console.log(str);
      if (value.length === 1 && args !== undefined) {
        console.log(str);
        return str + ' ' + args;
      }
    }

    return str;
  }

}
