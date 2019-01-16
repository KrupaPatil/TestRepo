import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { HumidorModel } from './../models/humidor.model';

@Pipe({name: 'humidorsTotalCigars'})
export class HumidorsTotalCigarsPipe implements PipeTransform {

  transform(humidors: HumidorModel[]): string {
    const total = _.sumBy(humidors, (humidor: HumidorModel) => +humidor.getTotalNumberOfCigars());
    return `${total} ${ total == 1 ? 'cigar' : 'cigars' }`;
  }
}
