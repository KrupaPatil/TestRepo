import { BaseModel } from './base.model';
import * as _ from 'lodash';

export const REVIEW_ID_TYPE = 'review';
export const NEPTUNE_ID_TYPE = 'neptune';

export class ProductReviewModel extends BaseModel {

  constructor(data: Object) {
    super(data);
    this.setId();
  }

  Id: string;
  ReviewId: number;
  NeptuneReviewId: number;
  UserId: number;
  UUID: string;
  MemberId: number;
  FirstName: string;
  LastName: string;
  ProductId: number;
  LineId: number;
  Rating: number;
  Comment: string;
  DrawRating: number;
  AppearanceRating: number;
  BurnRating: number;
  AromaRating: number;
  TasteRating: number;
  CreatedOn: string;
  UpdatedOn: string;

  public static decomposeId(id) {
    let {type, idStr} = id.split('-');

    if ('R' === type) {
      type = REVIEW_ID_TYPE;
    } else {
      type = NEPTUNE_ID_TYPE;
    }

    return {
      type: type,
      id: _.parseInt(idStr)
    };
  }

  private setId() {
    if (this.Id) {
      return;
    }

    if (this.ReviewId) {
      this.Id = 'R-' + this.ReviewId;
    } else {
      this.Id = 'N-' + this.NeptuneReviewId;
    }
  }

}
