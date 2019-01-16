import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ShapeResource } from "../resources/shape.resource";

@Injectable()
export class ShapeResolver implements Resolve<any> {
  constructor(
    private shapeResource: ShapeResource
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.shapeResource.get(route.params['Id']);
  }
}
