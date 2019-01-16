import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { KnowledgeModel } from '../../models/knowledge.model';
import { SubmodelMapperService } from './submodel-mapper.service';

@Injectable()
export class KnowledgeDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'knowledge', KnowledgeModel, submodelMapperService, []);
  }
}
