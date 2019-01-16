import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { TopScannedCigarsDbResource } from "./db/top-scanned-cigars-db.resource";
import { TopScannedCigarsApiResource } from "./api/top-scanned-cigars-api.resource";

@Injectable()
export class TopScannedCigarsResource extends BaseResource {

  constructor(db: TopScannedCigarsDbResource,
              api: TopScannedCigarsApiResource,
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
