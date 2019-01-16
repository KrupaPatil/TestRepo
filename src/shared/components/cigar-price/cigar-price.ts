import { Component, Input } from '@angular/core';
import { ProductPricesModel } from '../../models/product-prices.model';

@Component({
  selector: 'cigar-price',
  templateUrl: 'cigar-price.html'
})
export class CigarPrice {

  @Input() type: string;
  @Input() cigarPrices: ProductPricesModel;
  @Input() boxQuantityMin: number;
  @Input() boxQuantityMax: number;

}
