import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { TopRatedCigarsDbResource } from "./db/top-rated-cigars-db.resource";
import { TopRatedCigarsApiResource } from "./api/top-rated-cigars-api.resource";

@Injectable()
export class TopRatedCigarsResource extends BaseResource {

  constructor(db: TopRatedCigarsDbResource,
              api: TopRatedCigarsApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getList(days, strength) {
    return this._get(
      this.api.getList(days, strength),
      this.db.getCollectionItem({'days': days,'strength': strength}),
      this.db.updateCollectionItem({'days': days, 'strength': strength})
    );
  }

}
