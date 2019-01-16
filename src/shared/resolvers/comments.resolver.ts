import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import {CommentData} from '../data/comment.data';
import { EmitterService } from '../services/emitter.service';

@Injectable()
export class CommentsResolver implements Resolve<any> {
  constructor(private commentData: CommentData,
              private emitterService: EmitterService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.commentData.getComments(route.params['Id'], 0, 100);
  }
}
