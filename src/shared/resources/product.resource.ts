import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { ProductDbResource } from './db/product-db.resource';
import { ProductApiResource } from './api/product-api.resource';
import { SearchableResourceInterface } from './searchable-resource.interface';
import { ProductModel } from '../models/product.model';
import { ManualCigarEntryModel } from '../models/manual-cigar-entry.model';

@Injectable()
export class ProductResource extends BaseResource implements SearchableResourceInterface {

  constructor(db: ProductDbResource,
              api: ProductApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public get(id, loadSubmodels?) {
    return this._get(
      this.api.get(id),
      this.db.getCollectionItem({'Id': id}, loadSubmodels),
      this.db.updateCollectionItem({'Id': id}, loadSubmodels)
    );
  }

  public getList(filter, sort?, ascending?, take?, skip?) {
    return this._get(
      this.api.getList(filter.params),
      this.db.getCollection(filter, sort, ascending, take, skip),
      this.db.updateCollection(filter, sort, ascending, take, skip)
    );
  }

  createCustom(cigar: ManualCigarEntryModel) {
    return this.api.createCustom(cigar);
  }

  updateCustom(product: ProductModel) {
    return this._upsertWithDeferredApiCall(
      this.api.updateCustom(product),
      this.db.updateCollectionItem({'Id': product.Id}),
      product
    );
  }

  search(term, skip, take, list?) {
    return this.api.search(term, skip, take, list);
  }

  saveNote(product: ProductModel) {
    return this._upsertWithDeferredApiCall(
      this.api.saveNote(product),
      this.db.updateCollectionItem({'Id': product.Id}),
      product
    );
  }

}
