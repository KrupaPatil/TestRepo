import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';

import { extractErrorMsg } from '../../../app/app.common';
import { PostPopoverPage } from '../../../pages/social/post-popover/post-popover';
import { ActiveUserService } from '../../../shared/services/active-user.service';
import { SocialPostData } from '../../data/social-post.data';
import { SocialPostModel } from '../../models/social-post.model';
import { RouterService } from '../../services/router.service';


@Component({
  selector: 'social-post',
  templateUrl: 'social-post.html'
})
export class SocialPost {
  @Input() posts: [SocialPostModel];
  @Input() post: SocialPostModel;
  @Input() showSocialDetails: boolean;
  @Input() userSocialPosts: boolean;
  @Output() toggleFollowUserClicked = new EventEmitter<SocialPostModel>();
  @Output() navigateToCommentsClicked = new EventEmitter<SocialPostModel>();
  @Output() navigateToProductClicked = new EventEmitter<SocialPostModel>();
  @Output() navigateToPostLikesClicked = new EventEmitter<SocialPostModel>();

  constructor(private socialPostData: SocialPostData,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private router: RouterService,
              private route: ActivatedRoute,
              private activeUserService: ActiveUserService) {
  }

  isOwnedByLoggedInUser(user) {
    if (this.activeUserService.user() && user.UserId) {
      return user.UserId == this.activeUserService.user().Id;
    } else {
      return false;
    }
  }

  displayUserImage(post) {
    //remove this line after the new post structure has been used by most of the users
    if (!post.CigarRating) return true;

    if (!post.ImageUrl) return false;
    let bandStringPart = 'az571366.vo.msecnd.net';
    if (post.ImageUrl.indexOf(bandStringPart) == -1) {
      return true;
    } else {
      return false;
    }
  }

  toggleLike(post) {
    this.socialPostData.toggleLike(post)
      .subscribe(
        () => {
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  navigateToUSerProfile(user) {
    const id = user.UserId || user.UUID;
    const userType = user.UserId ? 'users' : 'guests';

    if (this.userSocialPosts) {
      this.router.navigate([`/social/user-profile/${userType}/${id}`]);
    } else {
      this.router.navigate([`./user-profile/${userType}/${id}`], {relativeTo: this.route});
    }
  }

  toggleFollowUser(post) {
    if (!this.activeUserService.isAuthenticated()) {
      this.router.navigate(['/', 'login']);
      return;
    }

    this.socialPostData.toggleFollowUser(post.User.UserId, post.User.Followed).subscribe(
      () => {
        if (this.userSocialPosts) {
          _.each(this.posts, (post) => {
            post.User.Followed = !post.User.Followed;
          });
        }
      }
    )
  }

  navigateToComments(post) {
    if (this.userSocialPosts) {
      this.router.navigate(['./social/post/' + post.Id]);
    } else {
      this.router.navigate(['./post/' + post.Id], {relativeTo: this.route});
    }
  }

  navigateToPostLikes(post) {
    if (!post.Likes) return;

    if (this.userSocialPosts) {
      this.router.navigate(['./social/likes/' + post.Id]);
    } else {
      this.router.navigate(['./likes/' + post.Id], {relativeTo: this.route});
    }
  }

  presentPopover(myEvent, postId) {
    let popover = this.popoverCtrl.create(PostPopoverPage, {
      showConfirm: () => {
        let alert = this.alertCtrl.create({
          subTitle: 'Are you sure you want to delete this post?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Delete',
              handler: () => {
                this.socialPostData.deletePost(postId, false)
                  .subscribe(
                    (res) => {
                      _.remove(this.posts, (post) => post.Id === postId);
                    },
                    (err) => {
                      let alert = this.alertCtrl.create({
                        title: 'Error occurred',
                        subTitle: extractErrorMsg(err),
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                  );

              }
            }
          ]
        });
        alert.present();
      }
    });
    popover.present({
      ev: myEvent
    });
  }
}
