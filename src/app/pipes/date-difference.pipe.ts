import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateDifference'
})
export class DateDifferencePipe implements PipeTransform {

  transform(value: any,  arg1?: any , arg2?: any): any {

    const date = new Date();

    const st = {
      month: date.getMonth(),
      year: date.getFullYear(),
    };

    const now = moment(value);
    const openingTime = moment(new Date(arg1).setDate(date.getDate()));
    const closingTime = moment(new Date(arg2).setDate(date.getDate()));
    openingTime.set(st);
    closingTime.set(st);

    if (closingTime.isBefore(openingTime)) {
      closingTime.add(1, 'days');
    }

    if (now.isAfter(closingTime)) {
      openingTime.add(1 , 'days');
    }

    const diff = Math.abs(moment.duration(now.diff(openingTime)).asHours());
    const ret = diff < 1 ?
      parseInt(Math.abs(moment.duration(now.diff(openingTime)).asMinutes()).toString(), 10) + ' minutes' :
      parseInt(diff.toString(), 10) + ' hours';

    return ret;
  }

}
