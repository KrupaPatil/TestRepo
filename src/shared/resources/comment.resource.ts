import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { SocialPostModel } from '../models/social-post.model';
import { UserModel } from '../models/user.model';
import { CommentModel } from '../models/comment-model';
import * as _ from 'lodash';
import { CommentApiResource } from './api/comment-api.resource';

@Injectable()
export class CommentResource extends BaseResource {

  constructor(api: CommentApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public getComments(postId: number, skip: number, take: number) {
    return this.api.getComments(postId, skip, take)
  }

  public add(postId: number, comment: string) {
    return this.api.add(postId, comment);
  }

  public edit(postId: number, commentId: number, comment: string) {
    return this.api.edit(postId, commentId, comment);
  }

  public remove(postId: number, commentId: number, undoDelete: boolean) {
    return this.api.remove(postId, commentId, undoDelete);
  }

}
