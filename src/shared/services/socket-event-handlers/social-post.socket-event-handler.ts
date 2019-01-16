import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { SocialPostData } from '../../data/social-post.data';
import { SocialPostModel } from '../../models/social-post.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { ActiveUserService } from './../active-user.service';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class SocialPostSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private socialPostData: SocialPostData,
    private activeUserService: ActiveUserService
  ) { }

  created(socketMessage: SocketMessageModel) {
    let postItem = new SocialPostModel(socketMessage.Data);
    let userId = this.activeUserService.getID();

    if (
      postItem.FollowerIds &&
      userId &&
      _.includes(postItem.FollowerIds, userId)
    ) {
      postItem.User.Followed = true;
    }

    return this.socialPostData.updateLoadedPost(postItem);
  }

  deleted(socketMessage: SocketMessageModel) {
    return this.socialPostData.deleteLoadedPost(socketMessage.Data);
  }

  updated(socketMessage: SocketMessageModel) {
    return this.socialPostData.updatePost(socketMessage.Data);
  }

}
