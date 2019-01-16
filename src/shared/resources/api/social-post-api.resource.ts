import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { ApiResourceInterface } from './api-resource.interface';
import { BaseApiResource } from './base-api.resource';

@Injectable()
export class SocialPostApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  getList(skip: number, limit: number, comments: number, id: string, followedPostsParam: string) {
    return this.apiService.get(`social/posts?skip=${skip}&take=${limit}&topcomments=${comments}${id}${followedPostsParam}`)
      .map(res => res.json());
  }

  like(postId: number) {
    return this.apiService.post(`social/posts/${postId}/like`, {})
  };

  unlike(postId: number) {
    return this.apiService.delete(`social/posts/${postId}/like`)
  };

  getPost(postId: number) {
    return this.apiService.get(`social/posts/${postId}`)
      .map(res => res.json());
  }

  getMyDistinctList() {
    return this.apiService.get(`cigars/mydistinct`)
      .map(res => res.json());
  }

  createPost(productId: number, lineId: number, title: string, text: string, imageUrl: string, location: string) {
    return this.apiService.post(
      'social/posts/',
      {
        ProductId: productId,
        LineId: lineId,
        Title: title,
        Text: text,
        ImageUrl: imageUrl,
        Location: location
      })
      .map(res => res.json());
  }

  deletePost(postId: number, undoDelete: boolean) {
    return this.apiService.delete(`social/posts/${postId}?undo=${undoDelete}`);
  }

  getPostLikes(postId: number, skip: number, take: number) {
    return this.apiService.get(`social/posts/${postId}/likes?skip=${skip}&take=${take}`)
      .map(res => res.json());
  }

  followUser(userId) {
    return this.apiService.post(`social/users/${userId}/follow`, {});
  }

  unfollowUser(userId) {
    return this.apiService.post(`social/users/${userId}/unfollow`, {});
  }
}
