import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'closed'
})
export class ClosedPipe implements PipeTransform {

  // Return true if value is between arag1 and arg2
  // else Return False

  transform(value: any, arg1?: any, arg2?: any): any {
    const date = new Date();

    const st = {
      month: date.getMonth(),
      year: date.getFullYear()
    };

    const now = moment(value);
    const openingTime = moment(new Date(arg1).setDate(date.getDate()));
    const closingTime = moment(new Date(arg2).setDate(date.getDate()));
    openingTime.set(st);
    closingTime.set(st);

    if (closingTime.isBefore(openingTime)) {
      closingTime.add(1, 'days');
    }

    // this.logger.info(now.toString() , '\n' , openingTime.toString() , '\n', closingTime.toString() , '\n\n');

    return now.isBetween(openingTime, closingTime);
  }
}
