import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { SubmodelMapperService } from "./submodel-mapper.service";
import { ProductModel } from "../../models/product.model";

@Injectable()
export class TopScannedCigarsDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'top-scanned-cigars', ProductModel, submodelMapperService, []);
  }

}
