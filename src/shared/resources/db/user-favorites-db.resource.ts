import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { FavoritesItemModel } from "../../models/favorites-item.model";
import { SubmodelMapperService } from "./submodel-mapper.service";

@Injectable()
export class UserFavoritesDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'user-favorites', FavoritesItemModel, submodelMapperService, [
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
