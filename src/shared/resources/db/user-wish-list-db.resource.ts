import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { WishListItemModel } from "../../models/wish-list-item.model";
import { SubmodelMapperService } from "./submodel-mapper.service";

@Injectable()
export class UserWishListDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'user-wish-list', WishListItemModel, submodelMapperService, [
      {
        get: 'Product',
        set: 'Product',
        dbResource: 'ProductDbResource',
        resource: 'ProductResource',
        isCollection: false,
      }
    ]);
  }

}
