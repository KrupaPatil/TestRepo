import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { HumidorCigarModel} from "../models/humidor-cigar.model";

@Pipe({name: 'sortHumidorsPipe'})
export class SortHumidorsPipe implements PipeTransform {

  transform(cigars: HumidorCigarModel[]) {
    return _.orderBy(
      cigars,
      [
        (cigar: HumidorCigarModel) => cigar.Product.ImageUrl ? 0 : 1,
        (cigar: HumidorCigarModel) => cigar.Product.MyRating ? cigar.Product.MyRating.Rating : 0
      ],
      [
        'asc',
        'desc'
      ]
    );
  }
}
