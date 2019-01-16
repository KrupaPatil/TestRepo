import { Injectable, Injector } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CommentResource } from '../resources/comment.resource';
import { SocialPostData } from './social-post.data';

@Injectable()

export class CommentData {

  private resource;
  private post;

  constructor(
    injector: Injector,
    private socialPostData: SocialPostData,
    private loadingCtrl: LoadingController
  ) {
    this.resource = injector.get(CommentResource);
  }

  getComments(postId: number, skip: number, take: number) {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();
    return new Observable((o: Observer<any>) => {
      return this.resource.getComments(postId, skip, take)
        .subscribe(
          (post) => {
            this.post = post;
            loading.dismiss();
            o.next(this.post);
            return o.complete();
          },
          (err) => {
            loading.dismiss();
            return o.error(err);
          }
        )
    })
  }

  public add(postId: number, comment: string) {
    return new Observable((o: Observer<any>) => {
      return this.resource.add(postId, comment)
        .subscribe(
          (comment) => {
            this.post.TopComments.unshift(comment);
            this.socialPostData.addComment(postId, comment);
            this.socialPostData.updateCommentsNumber(postId, 1);
            o.next(comment);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        )
    })
  }

  public edit(postId: number, commentId: number, comment: string) {
    return new Observable((o: Observer<any>) => {
      return this.resource.edit(postId, commentId, comment)
        .subscribe(
          (res) => {
            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        )
    })
  }

  public remove(postId: number, commentId: number, undoDelete: boolean) {
    return new Observable((o: Observer<any>) => {
      return this.resource.remove(postId, commentId, undoDelete)
        .subscribe(
          (res) => {
            _.remove(this.post.TopComments, (item: any) => item.Id === commentId);
            this.socialPostData.deleteComment(postId, commentId);
            this.socialPostData.updateCommentsNumber(postId, -1);
            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        )
    })
  }

  addToLoadedComments(comment) {
    return new Observable((o: Observer<any>) => {
      if (!this.post) {
        return o.complete();
      }
      let existing = _.has(comment, 'Id') ? _.find(this.post.TopComments, { 'Id': comment.Id }) : null;
      if (!existing) {
        this.post.TopComments.push(comment);
        o.next(comment);
        return o.complete();
      }
    });
  }

  editLoadedComment(comment) {
    return new Observable((o: Observer<any>) => {
      if (!this.post) {
        return o.complete();
      }
      let existing = (_.has(comment, 'Id') ? _.find(this.post.TopComments, { 'Id': comment.Id }) : null) as any;
      if (existing) {
        existing.Text = comment.Text;
        o.next(comment);
        return o.complete();
      }
    });
  }

  deleteLoadedComment(commentId) {
    return new Observable((o: Observer<any>) => {
      if (!this.post) {
        return o.complete();
      }
      _.remove(this.post.TopComments, (item: any) => item.Id === commentId);
      o.next({});
      return o.complete();
    });
  }
}
