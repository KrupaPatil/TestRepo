import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';

@Injectable()
export class UserSearchApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public userSearch(skip, take, searchTerm, friendList=false) {
    return this.apiService.post(`social/profiles/search?friendlist=${friendList}&skip=${skip}&take=${take}`, this._prepareStringAsPayload(searchTerm))
      .map(res => res.json());
  }
}
