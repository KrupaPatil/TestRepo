import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';

@Injectable()
export class UserDataSummaryApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public getUserDataSummary() {
    return this.apiService.get('datasummary/user')
      .map(res => res.json());
  }
}
