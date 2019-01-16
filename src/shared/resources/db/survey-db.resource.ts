import { Injectable } from '@angular/core';
import { CollectionDbResource } from './collection-db.resource';
import { DbResourceInterface } from './db-resource.interface';
import { StorageService } from '../../services/storage.service';
import { SubmodelMapperService } from './submodel-mapper.service';
import { SurveyModel } from '../../models/survey.model';

@Injectable()
export class SurveyDbResource extends CollectionDbResource implements DbResourceInterface {

  constructor(storageService: StorageService, submodelMapperService: SubmodelMapperService) {
    super(storageService, 'survey', SurveyModel, submodelMapperService, []);
  }

}
