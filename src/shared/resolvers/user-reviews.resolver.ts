import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserProfileResource } from '../resources/user-profile.resource';

@Injectable()
export class UserReviewsResolver implements Resolve<any> {
  constructor(private userProfileResource: UserProfileResource) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userProfileResource.getUserReviews(route.params['Id'], route.params['userType']);
  }
}
