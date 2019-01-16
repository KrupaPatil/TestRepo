import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { UserProfileApiResource } from './api/user-profile-api.resource';
import { UserProfileDbResource } from './db/user-profile-db.resource';

@Injectable()
export class UserProfileResource extends BaseResource {
  constructor(db: UserProfileDbResource,
              api: UserProfileApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getUserProfile(id, userType) {
    return this._get(
      this.api.getUserProfile(id, userType),
      this.db.getCollectionItem({'id': id}),
      this.db.updateCollectionItem({'id': id})
    )
  }

  public getUserList(id, list, userType) {
    return this._get(
      this.api.getUserList(id, list, userType),
      this.db.getCollectionItem({'id': id}),
      this.db.updateCollectionItem({'id': id})
    )
  }

  public getUserHumidors(id, userType) {
    return this._get(
      this.api.getUserHumidors(id, userType),
      this.db.getCollectionItem({'id': id}),
      this.db.updateCollectionItem({'id': id})
    )
  }

  public getUserPosts(id, userType) {
    return this._get(
      this.api.getUserPosts(id, userType),
      this.db.getCollectionItem({'id': id}),
      this.db.updateCollectionItem({'id': id})
    )
  }

  public getUserReviews(id, userType) {
    return this._get(
      this.api.getUserReviews(id, userType),
      this.db.getCollectionItem({'id': id}),
      this.db.updateCollectionItem({'id': id})
    )
  }

  public getUserFollows(id, userType, take, skip) {
    return this._get(
      this.api.getUserFollows(id, userType, take, skip),
      this.db.getCollectionItem({'id': id}),
      this.db.updateCollectionItem({'id': id})
    )
  }
}
