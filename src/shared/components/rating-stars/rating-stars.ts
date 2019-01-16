import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rating-stars',
  templateUrl: 'rating-stars.html'
})
export class RatingStars implements OnInit {
  @Input() rating: number;
  @Input() size: number;
  @Input() starColor: string;
  @Input() rateable: boolean = false;
  @Input() setAll: boolean = false;
  @Output() onRate = new EventEmitter<number>();
  @Output() setAllStars = new EventEmitter<number>();


  allStars = [];
  fullStars: number;
  incompleteStar: number;
  borderImageLink = 'assets/images/outer-rating-star.svg';
  fillImageLink = 'assets/images/inner-rating-star.svg';


  ngOnInit() {
    this.allStars.length = 5;
    this.setRating(this.rating);

    if (this.starColor == 'yellow') {
      this.borderImageLink = 'assets/images/outer-rating-star-yellow.svg';
      this.fillImageLink = 'assets/images/inner-rating-star-yellow.svg';
    }
  }

  ngOnChanges() {
    this.setRating(this.rating);
  }

  fillPercentage(currentStar) {
    currentStar++;
    if (currentStar <= this.fullStars) {
      return 100;

    } else if (currentStar == this.fullStars + 1) {
      return this.incompleteStar;
    }
    else {
      return 0;
    }
  }

  changeRating(value) {
    if (this.rateable) {
      if (this.setAll) {
        this.setAllStars.emit(value);
      } else {
        this.setRating(value);
        this.onRate.emit(value);
      }
    }
  }

  setRating(value) {
    this.fullStars = Math.floor(value);
    this.incompleteStar = Math.round((value - this.fullStars) * 100);
  }
}
