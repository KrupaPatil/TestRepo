import { Injectable } from '@angular/core';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { ProductModel } from "../../models/product.model";
import { CollectionDbResource } from "./collection-db.resource";
import { SubmodelMapperService } from "./submodel-mapper.service";

@Injectable()
export class ProductDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'products', ProductModel, submodelMapperService, [
      {
        get: 'Shapes',
        set: 'Shapes',
        dbResource: 'ProductShapeDbResource',
        resource: 'ProductShapeResource',
        isCollection: true,
      }
    ]);
  }

}
