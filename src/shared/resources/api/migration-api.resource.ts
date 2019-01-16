import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiService } from '../../services/api.service';

@Injectable()
export class MigrationApiResource extends BaseApiResource {

  constructor(private apiService: ApiService) {
    super();
  }

  public migrate(user) {
    return this.apiService.post('migration/frombackup', user)
      .map(res => res.json());
  }

}
