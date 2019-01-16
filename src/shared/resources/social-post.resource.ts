import { Injectable } from '@angular/core';

import { SocialPostApiResource } from './api/social-post-api.resource';

@Injectable()
export class SocialPostResource {

  constructor(
    private api: SocialPostApiResource
  ) {}

  getList(skip: number, limit: number, comments: number, id: string = '', followedPostsParam: string = '') {
    return this.api.getList(skip, limit, comments, id, followedPostsParam);
  }

  like(postId: number) {
    return this.api.like(postId);
  }

  unlike(postId: number) {
    return this.api.unlike(postId);
  }

  getMyDistinctList() {
    return this.api.getMyDistinctList();
  }

  createPost(ProductId: number, LineId: number, Title: string, Text: string, ImageUrl: string, Location: string) {
    return this.api.createPost(ProductId, LineId, Title, Text, ImageUrl, Location);
  }

  deletePost(postId: number, undoDelete: boolean) {
    return this.api.deletePost(postId, undoDelete);
  }

  getPostLikes(postId: number, skip: number, take: number) {
    return this.api.getPostLikes(postId, skip, take);
  }

  followUser(userId) {
    return this.api.followUser(userId);
  }

  unfollowUser(userId) {
    return this.api.unfollowUser(userId);
  }
}
