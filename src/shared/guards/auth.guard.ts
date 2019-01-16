import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { ActiveUserService } from '../services/active-user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private activeUserService: ActiveUserService) {
  }

  canActivate( routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.activeUserService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    return true;
  }
}
