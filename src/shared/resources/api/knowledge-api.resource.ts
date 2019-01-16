import { Injectable } from '@angular/core';
import { KnowledgeModel } from '../../models/knowledge.model';
import { ApiService } from '../../services/api.service';
import { BaseApiResource } from './base-api.resource';

@Injectable()
export class KnowledgeApiResource extends BaseApiResource {

  constructor(private apiService: ApiService) {
    super();
  }
  public getList() {
    return this.apiService.get('content/tutorials')
      .map(
        res => this._mapCollection(KnowledgeModel, res.json())
      );
  }

  public getListItem(id) {
    return this.apiService.get('content/tutorials/' + id, {})
      .map(res => res.json());
  }
}
