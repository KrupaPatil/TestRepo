import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PlaceResource } from "../resources/place.resource";
import { RouterService } from "../services/router.service";

@Injectable()
export class PlaceResolver implements Resolve<any> {
  constructor(
    private placeResource: PlaceResource,
    private router: RouterService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let params = this.router.getParams();

    if (params && params['Id'] === route.params['Id'] && params['Place']) {
      return params['Place'];
    }

    return this.placeResource.get(route.params['Id']);
  }
}
