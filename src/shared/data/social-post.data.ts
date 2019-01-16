import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { SocialPostResource } from '../resources/social-post.resource';

@Injectable()
export class SocialPostData {

  public posts = [];
  public productPosts = [];
  public selectedPosts = this.posts;
  public selectedTypedAllPosts = true;
  private resource;

  constructor(injector: Injector) {
    this.resource = injector.get(SocialPostResource);
  }

  public getList(skip: number, limit: number, comments: number, paramId: any = null, clearCache = false) {
    let id, followedPostsParam;
    if (paramId) {
      let splitParam = paramId.split('-');
      if (splitParam[0] == 'L') {
        id = '&lineid=' + splitParam[1];
      } else {
        id = '&productid=' + splitParam[1];
      }
    }

    if (!this.selectedTypedAllPosts && !id) {
      followedPostsParam = '&FollowedOnly=true'
    }

    return new Observable((o: Observer<any>) => {
      return this.resource.getList(skip, limit, comments, id, followedPostsParam)
        .subscribe(
          (res) => {
            if (res.length) {
              if (clearCache) {
                this.selectedPosts.length = 0;
              }
              _.each(res, item => {
                this.selectedPosts.push(item);
              });
              o.next(this.selectedPosts);
              return o.complete();
            } else {
              o.next(res);
              return o.complete();
            }
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  getMyDistinctList() {
    return new Observable((o: Observer<any>) => {
      return this.resource.getMyDistinctList()
        .subscribe(
          (res) => {
            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  toggleLike(post) {
    let action = post.Liked ? 'unlike' : 'like';
    if (action == 'like') {
      post.Liked = true;
      post.Likes = post.Likes + 1;
    } else {
      post.Liked = false;
      post.Likes = post.Likes - 1;
    }

    return this.resource[action](post.Id);
  }

  createPost(ProductId: number, LineId: number, Title: string, Text: string, ImageUrl: string, Location: string) {
    return new Observable((o: Observer<any>) => {
      return this.resource.createPost(ProductId, LineId, Title, Text, ImageUrl, Location)
        .subscribe(
          (post) => {
            this.selectedPosts.unshift(post);
            o.next(post);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        )
    });
  }

  getPostLikes(postId: number, skip: number, take: number) {
    return new Observable((o: Observer<any>) => {
      return this.resource.getPostLikes(postId, skip, take)
        .subscribe(
          (res) => {
            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        )
    });
  }

  deletePost(postId, undoDelete) {
    return new Observable((o: Observer<any>) => {
      _.remove(this.selectedPosts, (item) => item.Id === postId);

      return this.resource.deletePost(postId, undoDelete)
        .subscribe(
          (res) => {
            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  deleteLoadedPost(postId) {
    return new Observable((o: Observer<any>) => {
      _.remove(this.posts, (item) => item.Id === postId);
      o.next({});
      return o.complete();
    });
  }

  updateLoadedPost(post) {
    return new Observable((o: Observer<any>) => {
      let existing = _.has(post, 'Id') ? _.find(this.posts, {'Id': post.Id}) : null;
      if (existing) {
        _.assignIn(existing, post);
        o.next(existing);
        return o.complete();
      } else {
        this.posts.unshift(post);
        o.next(post);
        return o.complete();
      }
    });
  }

  addComment(postId, comment) {
    let post = _.find(this.selectedPosts, {'Id': postId});
    if (post) {
      post.TopComments.unshift(comment);
    }
  }

  deleteComment(postId, commentId) {
    let post = _.find(this.selectedPosts, {'Id': postId});
    if (post) {
      _.remove(post.TopComments, (item: any) => item.Id === commentId);
    }
  }

  updateCommentsNumber(postId, value) {
    let comment = _.find(this.selectedPosts, {'Id': postId});
    if (comment) {
      comment.Comments = comment.Comments + value;
    }
  }

  updatePost(post) {
    return new Observable((o: Observer<any>) => {
      let existing = _.find(this.selectedPosts, {'Id': post.Id});
      if (existing) {
        _.assignIn(existing, post);
        o.next(existing);
        return o.complete();
      }
    });
  }

  setSelectedPosts(id) {
    if (id) {
      this.productPosts = [];
      this.selectedPosts = this.productPosts;
    } else {
      this.selectedPosts = this.posts;
    }
  }

  toggleFollowUser(userId, followed) {
    return followed ?
      this.resource.unfollowUser(userId).map(() => {
        this.updateFollowedUsers(userId, followed);
      }) :
      this.resource.followUser(userId).map(() => {
        this.updateFollowedUsers(userId, followed);
      });
  }

  checkPostTypeStatus(status) {
    if (this.selectedTypedAllPosts != status) {
      this.selectedTypedAllPosts = status;
      this.selectedPosts.length = 0;
      return this.getList(0, 10, 2)
    } else {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }
  }

  updateActiveUser(userId, user) {
    _.each(this.posts, (post) => {
      if (post.User.UserId == userId) {
        _.assignIn(post.User, user);
      }
      _.each(post.TopComments, (comment) => {
        if (comment.User.UserId == userId) {
          _.assignIn(comment.User, user);
        }
      });
    });

    _.each(this.productPosts, (post) => {
      if (post.User.UserId == userId) {
        _.assignIn(post.User, user);
      }
      _.each(post.TopComments, (comment) => {
        if (comment.User.UserId == userId) {
          _.assignIn(comment.User, user);
        }
      });
    });
  }

  private updateFollowedUsers(userId, followed) {
    _.each(this.posts, (post) => {
      if (post.User.UserId == userId) {
        post.User.Followed = !followed;
      }
    });

    _.each(this.productPosts, (post) => {
      if (post.User.UserId == userId) {
        post.User.Followed = !followed;
      }
    });
  }
}




















