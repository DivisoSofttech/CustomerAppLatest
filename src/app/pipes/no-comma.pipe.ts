import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noComma'
})
export class NoCommaPipe implements PipeTransform {

  transform(val: any): number {
    if (val !== undefined && val !== null) {
      // here we just remove the commas from value
      return val.toString().replace(",", "");
    } else {
      return 0;
    }
  }
}