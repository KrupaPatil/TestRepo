import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { UserSearchApiResource } from './api/user-search-api.resource';

@Injectable()
export class UserSearchResource extends BaseResource {

  constructor(api: UserSearchApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public result = [];
  public term: string;
  public skip: number = 0;
  public take: number = 50;

  public userSearch() {
    return this.api.userSearch(this.skip, this.take, this.term);
  }

}
