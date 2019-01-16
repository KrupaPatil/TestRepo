import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { ProductReviewDbResource } from './db/product-review-db.resource';
import { ProductReviewApiResource } from './api/product-review-api.resource';
import { ProductReviewModel } from '../models/product-review.model';
import { createTemporaryId, removeMethods } from '../../app/app.common';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ProductDbResource } from './db/product-db.resource';
import { ProductModel } from '../models/product.model';

@Injectable()
export class ProductReviewResource extends BaseResource {

  constructor(db: ProductReviewDbResource,
              api: ProductReviewApiResource,
              injector: Injector,
              private productDb: ProductDbResource) {
    super(db, api, injector);
  }

  public getList(filter, sort, ascending, take, skip) {
    return this._get(
      this.api.getList(filter, take, skip),
      this.db.getCollection(filter, sort, ascending, take, skip),
      this.db.updateCollection(filter, sort, ascending, take, skip)
    );
  }

  public create(productRating: ProductReviewModel) {
    let params;
    if (!productRating.Id) {
      createTemporaryId(productRating);
      params = {'_Id': productRating['_Id']};
    } else {
      params = {'Id': productRating['Id']};
    }

    return this._upsertWithDeferredApiCall(
      this.api.create(productRating),
      this.dbUpdateFn(params),
      productRating
    );
  }

  public dbUpdateFn(params, updateProduct: boolean = true) {
    return (productRating) => {
      return new Observable((o: Observer<any>) => {

        this.db.updateExistingCollectionItem(params, true)(productRating)
          .subscribe(
            null,
            (err) => {
              if (err.status != 404) {
                return o.error(err);
              }
            });

        if (updateProduct) {
          let product = new ProductModel({
            ProductId: productRating.ProductId,
            LineId: productRating.LineId,
            MyRating: removeMethods(productRating)
          });

          this.productDb.updateExistingCollectionItem({Id: product.Id}, true)(product)
            .subscribe(
              null,
              (err) => {
                if (err.status != 404) {
                  return o.error(err);
                }
              });
        }

        o.next(productRating);
        o.complete();
      });
    };
  }

}
