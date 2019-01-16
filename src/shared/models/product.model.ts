import * as _ from 'lodash';

import { BaseModel } from './base.model';
import { ProductAttributesModel } from './product-attributes.model';
import { ProductImageModel } from './product-image.model';
import { ProductMyCigarFeaturesModel } from './product-my-cigar-features.model';
import { ProductNoteModel } from './product-note.model';
import { ProductPricesModel } from './product-prices.model';
import { ProductRatingModel } from './product-rating.model';
import { ProductReviewModel } from './product-review.model';
import { ProductTagModel } from './product-tag.model';

export const PRODUCT_TYPE = 'products';
export const LINE_TYPE = 'lines';

export class ProductModel extends BaseModel {

  constructor(data: Object) {
    super(data);
    this.setId();
  }

  public static nestedModels = {
    'Shapes': ProductModel,
    'RatingSummary': ProductRatingModel,
    'Prices': ProductPricesModel,
    'PartnerPrices': ProductPricesModel,
    'Tags': ProductTagModel,
    'Attributes': ProductAttributesModel,
    'Images': ProductImageModel,
    'MyNote': ProductNoteModel,
    'MyRating': ProductReviewModel,
  };

  public static mappings = {
    'Rating': 'RatingSummary',
  };

  Id: string;
  ProductId: number;
  LineId: number;
  Date: string;
  Name: string;
  ImageUrl: string;
  ImageUrlSmall: string;
  ImageOfSingleUrl: string;
  UserImageUrl: string;
  RatingSummary: ProductRatingModel;
  Prices: ProductPricesModel;
  PartnerPrices: ProductPricesModel;
  Shapes: ProductModel[];
  Attributes: ProductAttributesModel;
  BandHistory: [any];
  Description: string;
  Images: ProductImageModel[];
  MaxBoxQty: number;
  MinBoxQty: number;
  MyCigarFeatures: ProductMyCigarFeaturesModel;
  MyNote: ProductNoteModel;
  MyRating: ProductReviewModel;
  Tags: ProductTagModel[];
  CanonicalUrl: string;
  IsCustom: boolean;
  ShowOptions: boolean;

  getType() {
    if (this.ProductId) {
      return PRODUCT_TYPE;
    } else {
      return LINE_TYPE;
    }
  }

  getDetailsUrl() {
    return '/cigar/' + this.Id;
  }

  bestPrices(): ProductPricesModel {
    return new ProductPricesModel({
      SinglePriceMin: this.bestSinglePrice(),
      BoxPriceMin: this.bestBoxPrice()
    });
  }

  bestSinglePrice() {
    let prices = [];

    if (this.Prices && this.Prices.SinglePriceMin > 0) {
      prices.push(this.Prices.SinglePriceMin);
    }

    if (this.PartnerPrices && this.PartnerPrices.SinglePriceMin > 0) {
      prices.push(this.PartnerPrices.SinglePriceMin);
    }
    return _.min(prices);
  }

  bestBoxPrice() {
    let prices = [];

    if (this.Prices && this.Prices.BoxPriceMin > 0) {
      prices.push(this.Prices.BoxPriceMin);
    }

    if (this.PartnerPrices && this.PartnerPrices.BoxPriceMin > 0) {
      prices.push(this.PartnerPrices.BoxPriceMin);
    }
    return _.min(prices);
  }

  private setId() {
    if (_.isString(this.Id)) {
      return;
    } else if (_.isNumber(this.Id)) {
      // TODO: When Id on shapes api resource is renamed to productId this check should be removed
      this.ProductId = _.toNumber(this.Id);
    }

    if (this.ProductId) {
      this.Id = 'P-' + this.ProductId;
    } else {
      this.Id = 'L-' + this.LineId;
    }
  }

  public static decomposeId(id) {
    let params = id.split('-');
    let type = LINE_TYPE;

    if ('P' === params[0]) {
      type = PRODUCT_TYPE;
    }

    return {
      type: type,
      id: _.parseInt(params[1])
    };
  }

}
