import { Injectable } from '@angular/core';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';
import { SocketMessageModel } from '../../models/socket-message.model';
import { CommentData } from "../../data/comment.data";

@Injectable()
export class SocialCommentSocketEventHandler implements SocketEventHandlerInterface {

  constructor(private commentData: CommentData) { }

  created(socketMessage: SocketMessageModel) {
    let comment = socketMessage.Data;
    return this.commentData.addToLoadedComments(comment);
  }

  deleted(socketMessage: SocketMessageModel) {
    let commentId = socketMessage.Data;
    return this.commentData.deleteLoadedComment(commentId);
  }

  updated(socketMessage: SocketMessageModel) {
    let comment = socketMessage.Data;
    return this.commentData.editLoadedComment(comment);
  }

}
