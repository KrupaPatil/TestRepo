import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';

@Injectable()
export class CommentApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public getComments(postId: number, skip: number, take: number) {
    return this.apiService.get('social/posts/'+ postId +'?TopComments=' + take)
      .map(res => res.json());
  }

  public add(postId: number, comment: string) {
    return this.apiService.post('social/posts/' + postId + '/comments/', {'Text': comment})
      .map(res => res.json());
  }

  public edit(postId: number, commentId: number, comment: string) {
    return this.apiService.put('social/posts/' + postId + '/comments/' + commentId, {'Text': comment})
      .map(res => res.json());
  }

  public remove(postId: number, commentId: number, undoDelete: boolean) {
    return this.apiService.delete('social/posts/' + postId + '/comments/' + commentId + '?undo=' + undoDelete)
  }


  public getComment(postId: number, commentId: number) {
    return this.apiService.get('social/posts/' + postId + '/comments/' + commentId)
      .map(res => res.json());
  }

}
