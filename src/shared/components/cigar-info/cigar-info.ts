import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'cigar-info',
  templateUrl: 'cigar-info.html'
})
export class CigarInfo {

  @Input() topRatedCigar;
  @Input() cigar: ProductModel;
  @Input() date: string;
  @Input() selected: boolean;
  @Input() productPost: boolean;
  @Input() customPrice: number;
  @Input() actions: boolean = false;
  @Output() cigarClicked = new EventEmitter<ProductModel>();
  @Output() addClicked = new EventEmitter<ProductModel>();
  @Output() deleteClicked = new EventEmitter<ProductModel>();
  @Output() swipedLeft = new EventEmitter<ProductModel>();

  swipeCoord?: [number, number];
  swipeTime?: number;

  swipe(e: TouchEvent|MouseEvent, when: string, cigar: ProductModel): void {
    let coord;

    if (e instanceof TouchEvent) {
      coord = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    }
    else {
      coord = [e.pageX, e.pageY];
    }

    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    }
    else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //Rapid
        && Math.abs(direction[0]) > 30 //Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { //Horizontal enough

        const swipe = direction[0] < 0 ? 'left' : 'right';

        if (swipe == 'left') {
          this.swipedLeft.emit();
          cigar.ShowOptions = true;
        } else {
          cigar.ShowOptions = false;
        }
      }
    }
  }
}
