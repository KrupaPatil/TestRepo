import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { HumidorModel } from './../models/humidor.model';

@Pipe({name: 'humidorsTotalPrice'})
export class HumidorsTotalPricePipe implements PipeTransform {

  transform(humidors: HumidorModel[]): string {
    return _.sumBy(humidors, (humidor: HumidorModel) => +humidor.totalPrice()).toFixed(2);
  }
}
