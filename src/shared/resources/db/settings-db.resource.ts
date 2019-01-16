import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { SubmodelMapperService } from './submodel-mapper.service';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import {SettingsModel} from '../../models/settings.model';

@Injectable()
export class SettingsDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'settings', SettingsModel, submodelMapperService, []);
  }
}
