import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProductResource } from '../resources/product.resource';
import { EmitterService } from '../services/emitter.service';

@Injectable()
export class ProductResolver implements Resolve<any> {
  constructor(
    private productResource: ProductResource,
    private emitterService: EmitterService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.productResource.get(route.params['ShapeId'] || route.params['Id']);
  }

}
