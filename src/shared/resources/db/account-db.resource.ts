import { Injectable } from '@angular/core';

import { BaseDbResource } from './base-db.resource';
import { DbResourceInterface } from './db-resource.interface';

import { UserModel } from './../../models/user.model';

import { StorageService } from './../../services/storage.service';
import { SubmodelMapperService } from "./submodel-mapper.service";

@Injectable()
export class AccountDbResource extends BaseDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'account', UserModel, submodelMapperService, []);
  }

}
