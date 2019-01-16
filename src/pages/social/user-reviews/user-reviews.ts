import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from 'ionic-angular';
import { LayoutController } from '../../../shared/services/layout.controller';
import { extractErrorMsg } from '../../../app/app.common';
import { EmitterService } from '../../../shared/services/emitter.service';
import { RouterService } from '../../../shared/services/router.service';
import { PageLevelService } from '../../../shared/services/page-level.service';
import { SocialPostData } from '../../../shared/data/social-post.data';

@Component({
  selector: 'user-reviews',
  templateUrl: 'user-reviews.html'
})

export class UserReviews {

  private reviews;
  private reviewPost;
  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private location: Location,
              private pageLevelService: PageLevelService,
              private socialPostData: SocialPostData,
              private activatedRoute: ActivatedRoute,
              private emitterService: EmitterService) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'User Reviews',
      'showBackLink': false,
      'showMenuLink': false,
      'showSocialPostsGroup': false,
      'manualBackButton': true,
      'showCreateSocialPostButton': false
    });

    this.activatedRoute.data.subscribe((data:any) => {
      this.reviewPost = data.reviewPost;
      this.reviews = data.reviews;
      if (window.innerWidth > 1200) {
        this.emitterService.socialDetailsScreen(false);
      }
    });

    if (!this.reviewPost) {
      this.pageLevelService.userProfilePagesOnInit();
    } else {
      this.layoutCtrl.configure({
        'pageTitle': 'Post a Review',
      });
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

  createPost(post) {
    let {ProductId, LineId, Title, Text, ImageUrl, Location} = post;
    this.socialPostData.createPost(ProductId, LineId, Title, Text, ImageUrl, Location).subscribe(
      res => {
        let toast = this.toastCtrl.create({
          message: 'You have posted on social feed',
          duration: 2000,
          position: 'top',
        });
        toast.present();
        this.location.back();
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(err),
          buttons: ['OK']
        });
        alert.present();
      })
  }

  navigateToProduct(cigar) {
    if (window.innerWidth > 1200) {
    }

    let product;
    if (cigar.ProductId) {
      product = "P-" + cigar.ProductId;
    } else {
      product = "L-" + cigar.LineId;
    }
    if (product) {
      this.router.navigate(['./social/cigar/' + product]);
    }
  }

  ngOnDestroy() {
    if (!this.reviewPost) {
      this.pageLevelService.userProfilePagesOnDestroy();
    }
  }
}
