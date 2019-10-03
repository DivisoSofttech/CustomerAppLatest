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
      let nstr = dt.name.toLowerCase();
      nameArray.push(nstr.charAt(0).toUpperCase() +  nstr.slice(1));
      });
      str = nameArray.join(', ');
      if (value.length === 1 && args !== undefined) {
        return str + ' ' + args;
      }
    }

    return str;
  }

}
