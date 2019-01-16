import { Injectable, Injector } from '@angular/core';
import { ProductApiResource } from './api/product-api.resource';
import { ProductResource } from './product.resource';
import { ProductShapeDbResource } from './db/product-shape-db.resource';

@Injectable()
export class ProductShapeResource extends ProductResource {

  constructor(db: ProductShapeDbResource,
              api: ProductApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

}
