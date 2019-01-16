import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as _ from 'lodash';

@Pipe({name: 'priceRange'})
export class PriceRangePipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {
  }

  transform(prices: [number]): string {
    const priceMin = prices[0];
    const priceMax = prices[1];
    const quantityMin = prices[2];
    const quantityMax = prices[3];

    const priceMinFormatted = this._formatPrice(priceMin, quantityMin);
    const priceMaxFormatted = this._formatPrice(priceMax, quantityMax);

    let formattedPrice = '';

    if (priceMinFormatted.length > 0) {
      formattedPrice += priceMinFormatted;
    }

    if (priceMaxFormatted.length > 0 && priceMaxFormatted !== priceMinFormatted) {
      formattedPrice += formattedPrice ? ' - ' : '';
      formattedPrice += priceMaxFormatted;
    }

    return formattedPrice;
  }

  private _formatPrice(price, quantity) {
    let formattedPrice = '';

    if (_.isNumber(price)) {
      formattedPrice += '$' + this._round(price);

      if (_.isNumber(quantity)) {
        formattedPrice += ' /' + quantity;
      }
    }

    return formattedPrice;
  }

  private _round(price: number) {
    return this.decimalPipe.transform(price, '1.2-2');
  }
}
