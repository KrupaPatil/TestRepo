import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';
import { LINE_TYPE, PRODUCT_TYPE } from '../../models/product.model';
import { ProductReviewModel } from '../../models/product-review.model';
import * as _ from 'lodash';

@Injectable()
export class ProductReviewApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public getList(filter, take, skip) {
    let id, type, params = filter['params'];

    if (params['ProductId']) {
      id = params['ProductId'];
      type = PRODUCT_TYPE;
    } else {
      id = params['LineId'];
      type = LINE_TYPE;
    }

    let queryParams = {
      take: take,
      skip: skip,
      apponly: false,
      withcommentonly: params['WithCommentOnly'],
      rating: params['Rating']
    } as any;

    queryParams = this._encodeQueryParams(queryParams);

    return this.apiService.get('cigars/' + type + '/' + id + '/reviews' + '?' + queryParams)
      .map(res => this._mapCollection(ProductReviewModel, res.json()));
  }

  public create(productReview: ProductReviewModel) {
    let id = productReview.ProductId ? productReview.ProductId : productReview.LineId;
    let type = productReview.ProductId ? PRODUCT_TYPE : LINE_TYPE;

    let params = _.pick(productReview, [
      'Comment',
      'DrawRating',
      'AppearanceRating',
      'BurnRating',
      'AromaRating',
      'TasteRating'
    ]);

    return this.apiService.post('cigars/' + type + '/' + id + '/rate', params)
      .map(res => new ProductReviewModel(res.json()));
  }

}
