import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'cigar-search-results',
  templateUrl: 'cigar-search-results.html'
})
export class CigarSearchResults {
  @Input() title: string;
  @Input() results: Object;
  @Output() resultClick = new EventEmitter<ProductModel>();
}
