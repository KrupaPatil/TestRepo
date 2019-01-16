import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'localTime'})
export class LocalTimePipe implements PipeTransform {


  transform(time) {
     return moment.utc(time).local().format('MM/DD/YY - hh:mmA');
  }

}
