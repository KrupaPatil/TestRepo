import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DataSummaryResource } from '../resources/data-summary.resource';

@Injectable()
export class NoResultsResolver implements Resolve<any> {
  constructor(
    private dataSummaryResource: DataSummaryResource
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.dataSummaryResource.dataSummary()
  }
}
