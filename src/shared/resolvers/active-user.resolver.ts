import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActiveUserService } from "../services/active-user.service";

@Injectable()
export class ActiveUserResolver implements Resolve<any> {
  constructor(
    private activeUserService: ActiveUserService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.activeUserService.loadUser()
  }
}
