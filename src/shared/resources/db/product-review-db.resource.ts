import { Injectable } from '@angular/core';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { CollectionDbResource } from './collection-db.resource';
import { SubmodelMapperService } from './submodel-mapper.service';
import { ProductReviewModel } from '../../models/product-review.model';

@Injectable()
export class ProductReviewDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'product-reviews', ProductReviewModel, submodelMapperService, []);
  }

}
