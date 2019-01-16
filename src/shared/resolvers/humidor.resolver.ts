import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { MyHumidorsService } from "../services/my-humidors.service";

@Injectable()
export class HumidorResolver implements Resolve<any> {
  constructor(
    private myHumidorService: MyHumidorsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.myHumidorService.get(route.params['HumidorId']);
  }
}
