import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProductResource } from '../resources/product.resource';
import { ProductModel } from '../models/product.model';
import * as _ from 'lodash';
import { RouterService } from '../services/router.service';

@Injectable()
export class RelatedLinesResolver implements Resolve<any> {
  constructor(
    private productResource: ProductResource,
    private router: RouterService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let scanLog = this.router.getParam('scanLog');
    let humidor = this.router.getParam('humidor');

    if (humidor) {
      if (!_.isEmpty(scanLog.data.RelatedLines)) {
        const lineIds = _.map(scanLog.data.RelatedLines, 'Id').map(id => _.isNumber(id) ? 'L-' + id : id);

        let filter = {
          params: lineIds,
          filterFn: (params) => {
            return (product: ProductModel) => {
              return params.indexOf(product.Id) !== -1;
            }
          }
        };

        return this.productResource.getList(filter);
      }
    }
  }

}
