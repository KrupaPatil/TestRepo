import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { UserFavoritesDbResource } from './db/user-favorites-db.resource';
import { UserFavoritesApiResource } from './api/user-favorites-api.resource';

@Injectable()
export class UserFavoritesResource extends BaseResource {

  constructor(db: UserFavoritesDbResource,
              api: UserFavoritesApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getList(sort?, ascending?, take?, skip?) {
    return this._get(
      this.api.getList(sort, ascending, take, skip),
      this.db.getCollection(null, sort, ascending, take, skip),
      this.db.updateCollection(null, sort, ascending, take, skip)
    );
  }

  public create(data) {
    return this._upsertWithDeferredApiCall(
      this.api.save(data),
      this.db.updateCollectionItem({'_Id': data._Id}),
      data
    );
  }

  public remove(data) {
    return this._deleteWithDeferredApiCall(
      this.api.remove(data.Id),
      this.db.deleteCollectionItem({'Id': data.Id}),
      data
    );
  }

  public update(item) {
    return this._upsertWithDeferredApiCall(
      this.api.update(item),
      this.db.updateCollectionItem({'Id': item.Id}),
      item
    );
  }

  public copyItem(item, logId) {
    return this._upsertWithDeferredApiCall(
      this.api.copyItem(logId, item.List),
      this.db.updateCollectionItem({'_Id': item._Id}),
      item
    );
  }

}
