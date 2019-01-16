import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from 'ionic-angular';
import { ActiveUserService } from '../../../shared/services/active-user.service';
import { SocialPostModel } from '../../../shared/models/social-post.model';
import { CommentModel } from '../../../shared/models/comment-model';
import { LayoutController } from '../../../shared/services/layout.controller';
import { extractErrorMsg } from "../../../app/app.common";
import { RouterService } from '../../../shared/services/router.service';
import { CommentData } from '../../../shared/data/comment.data';
import { EmitterService } from '../../../shared/services/emitter.service';
import { Location } from '@angular/common';

@Component({
  selector: 'social-post-comments',
  templateUrl: 'comments.html'
})
export class SocialPostComments {

  private comments: [SocialPostModel];
  private text: string = '';
  private post;
  private postId: number;
  private drafts: string[] = [];
  private postsWrapper;
  private socialPageWrapper;
  private postsWrapperScrollDistance: number;

  constructor(private route: ActivatedRoute,
              private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private activeUserService: ActiveUserService,
              private location: Location,
              private emitterService: EmitterService,
              private router: RouterService,
              private commentData: CommentData) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.comments = data['post']['TopComments'];
      this.post = data['post'];
    });

    this.route.params.subscribe(params => {
      this.postId = parseInt(params['Id']);
      this.location.replaceState(this.location.path().replace(/\?.*$/g, ""));
    });

    this.layoutCtrl.configure({
      'pageTitle': 'Comments',
      'showMenuLink': false,
      'manualBackButton': true,
      'showFooter': false,
      'showSocialPostsGroup': false
    });

    this.postsWrapper = <HTMLElement>document.querySelector('.posts-wrapper');
    this.socialPageWrapper = <HTMLElement>document.querySelector('.social-page-wrapper')
    if (this.postsWrapper && window.innerWidth < 1200) {
      this.postsWrapperScrollDistance = this.socialPageWrapper.scrollTop;
      this.socialPageWrapper.style.height = '100%';
      this.socialPageWrapper.style.margin = 0;
      this.postsWrapper.style.position = 'fixed';
    } else {
      this.emitterService.socialDetailsScreen(false);
    }
  }

  addComment(form) {
    if (form.invalid) return;
    this.commentData.add(this.postId, this.text)
      .subscribe(
        (res) => {
          this.emitterService.socialDetailsScreen(true);
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

    this.text = '';
  }

  editComment(comment, form) {
    if (form.invalid) return;
    this.toggleEditMode(comment);
    this.commentData.edit(this.postId, comment.Id, comment.Text)
      .subscribe(
        () => {
        },
        (err) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      )
  }

  deleteComment(comment, index) {
    let alert = this.alertCtrl.create({
      title: 'Delete comment',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this._handleCommentDelete(this.postId, comment.Id);
          }
        }
      ]
    });

    alert.present();
  }

  inEditMode(comment: CommentModel) {
    return comment['_editMode'];
  }

  toggleEditMode(comment: CommentModel) {
    return comment['_editMode'] = !comment['_editMode'];
  }

  enterEditMode(comment) {
    this.drafts[comment.Id] = comment.Text;
    this.toggleEditMode(comment);
  }

  cancelEditMode(comment) {
    comment.Text = this.drafts[comment.Id];
    this.toggleEditMode(comment);
  }

  isOwnedByLoggedInUser(comment) {
    if (this.activeUserService.user() && comment.User.UserId) {
      return comment.User.UserId == this.activeUserService.user().Id;
    } else {
      return false;
    }
  }

  goToUserImage(image) {
    if (image) {
      this.router.navigate(['./user-image', {imageUrl: image}], {relativeTo: this.route});
    }
  }

  navigateToProduct(post) {
    let product;
    if (post.ProductId) {
      product = "P-" + post.ProductId;
    } else {
      product = "L-" + post.LineId;
    }
    if (product) {
      this.router.navigateByUrl('/cigar/' + product);
    }
  }

  navigateToPostLikes(post) {
    if (!post.Likes) return;
    this.router.navigateByUrl('/social/likes/' + post.Id);
  }

  navigateToUserProfile(user) {
    const id = user.UserId || user.UUID;
    const userType = user.UserId ? 'users' : 'guests';

    this.router.navigate([`/social/user-profile/${userType}/${id}`]);
  }

  private _handleCommentDelete(postId, commentId) {
    this.commentData.remove(postId, commentId, false)
      .subscribe(
        () => {
        },
        (err) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      )
  }

  ngOnDestroy() {
    if (this.postsWrapper && window.innerWidth < 1200) {
      setTimeout(() => {
        this.postsWrapper.style.position = null;
        this.socialPageWrapper.style.height = null;
        this.socialPageWrapper.style.margin = null;
        this.socialPageWrapper.scrollTop = this.postsWrapperScrollDistance;
        this.layoutCtrl.configure({
          'showFooter': true,
        });
      },)
    }
  }
}
