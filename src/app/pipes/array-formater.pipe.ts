import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFormater'
})
export class ArrayFormaterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const nameArray = [];
    let str = '';
    if (value !== undefined) {
      value.forEach(dt => {
      nameArray.push(dt.name.charAt(0).toUpperCase() +  dt.name.slice(1));
      });
      str = nameArray.join(', ');
      if (value.length === 1 && args !== undefined) {
        return str + ' ' + args;
      }
    }

    return str;
  }

}
