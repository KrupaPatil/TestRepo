import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SocialPostData } from "../data/social-post.data";

@Injectable()
export class PostLikesResolver implements Resolve<any> {
  constructor(private socialPostData: SocialPostData) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.socialPostData.getPostLikes(route.params['Id'], 0, 100);
  }
}
