import { BaseModel } from './base.model';

export class ProductRatingModel extends BaseModel {

  Rated1: number;
  Rated2: number;
  Rated3: number;
  Rated4: number;
  Rated5: number;
  AverageRating: number;
  RatingCount: number;

  ratingPercent(ratingName: string) {
    return this[ratingName] / this.RatingCount * 100;
  }

}
