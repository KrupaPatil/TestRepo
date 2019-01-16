import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'meterToMiles'})
export class MeterToMilesPipe implements PipeTransform {

  transform(value: number): number {
    return value * 0.000621371;
  }

}
