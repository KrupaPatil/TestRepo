import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { DataSummaryApiResource } from './api/data-summary-api.resource';

@Injectable()
export class DataSummaryResource extends BaseResource {

  constructor(api: DataSummaryApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public dataSummary() {
    return this.api.dataSummary();
  };
}
