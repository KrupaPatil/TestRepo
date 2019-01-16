import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { UserProfileModel } from '../../models/user-profile.model';
import { SubmodelMapperService } from './submodel-mapper.service';

@Injectable()
export class UserProfileDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'user-profile', UserProfileModel, submodelMapperService, []);
  }
}
