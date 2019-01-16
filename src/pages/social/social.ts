import { Location } from '@angular/common';
import { Component, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { AlertController, FabContainer, LoadingController, PopoverController } from 'ionic-angular';

import { extractErrorMsg } from '../../app/app.common';
import { SocialPostData } from '../../shared/data/social-post.data';
import { SocialPostModel } from '../../shared/models/social-post.model';
import { SurveyModel } from '../../shared/models/survey.model';
import { EmitterService } from '../../shared/services/emitter.service';
import { LayoutConfig } from '../../shared/services/layout-config';
import { LayoutController } from '../../shared/services/layout.controller';
import { RouterService } from '../../shared/services/router.service';
import { SurveyService } from '../../shared/services/survey.service';
import { SocialGroupPopover } from './social-group-popover/social-group-popover';
import { ActiveUserService } from "../../shared/services/active-user.service";

@Component({
  selector: 'social',
  templateUrl: 'social.html'
})
export class SocialPage {

  private posts: SocialPostModel[];
  private limit: number = 10;
  private commentsPerPost: number = 2;
  private hasMore: boolean = true;
  private isLoading: boolean = false;
  private showSocialDetails: boolean = false;
  private productPostsId = '';
  private activeUser;
  private socialPageWrapperElem;
  private refreshEnabled: boolean = true;
  showSurvey = false;
  survey: SurveyModel[] = [];

  constructor(private route: ActivatedRoute,
              private layoutCtrl: LayoutController,
              private socialPostData: SocialPostData,
              private alertCtrl: AlertController,
              private emitterService: EmitterService,
              private location: Location,
              private activeUserService: ActiveUserService,
              private layoutConfig: LayoutConfig,
              private renderer:Renderer2,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private angularRouter: Router,
              private surveyService: SurveyService,
              private router: RouterService) {
    this.posts = this.route.snapshot.data['posts'];
  }

  @ViewChild('socialPageWrapper') socialPageWrapper;

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.posts = data['posts'];
    });
    this.layoutCtrl.configure({
      'pageTitle': 'Social',
      'showMenuLink': true,
      'showBackLink': false,
      'manualBackButton': false,
      'showHeader': true,
      'showFooter': true,
      'showSearchProduct': false,
      'showSocialPostsGroup': true,
      'showUserSearch': true,
      'showCreateSocialPostButton': true
    });

    this.route.params.subscribe(data => {
      let param: any = data;
      if (param.Id) {
        this.productPostsId = param.Id;
        this.layoutCtrl.configure({
          'showSocialPostsGroup': false,
          'manualBackButton': true,
          'showMenuLink': false,
        });
      }
    });

    this.emitterService.socialDetailsScreentatus.subscribe((screenStatus: boolean) => {
      if (screenStatus) {
        this.closeDetails();
      } else {
        setTimeout(() => {
          this.showSocialDetails = true;
        })
      }
    });

    this.router.getEvents().subscribe((event: Event) => {
      if (event instanceof NavigationEnd &&
        event.url.indexOf('user-search') == -1 &&
        event.url.indexOf('cigar') == -1) {
        this.showSocialDetails = false;
      }
    });

    if (window.innerWidth < 1200) {
      this.surveyService.getSurveys().subscribe(
        (survey: SurveyModel[]) => {
          this.survey = survey;
          this.showSurvey = true;
        },
        (res) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }
  }

  ngAfterViewInit() {
    this.renderer.listen(this.socialPageWrapper.nativeElement, 'scroll', (event) => {
      let scrollTop = event.target.scrollTop;
      if (scrollTop > 0) {
        this.refreshEnabled = false;
      } else {
        this.refreshEnabled = true;
      }
    });
  }

  navigateToProduct(post) {
    if (window.innerWidth > 1200) {
      this.showSocialDetails = true;
    }

    let product;
    if (post.ProductId) {
      product = "P-" + post.ProductId;
    } else {
      product = "L-" + post.LineId;
    }
    if (product) {
      this.router.navigate(['./cigar/' + product], {relativeTo: this.route});
    }
  }

  navigateToUserSearch() {
    if (window.innerWidth > 1200) {
      this.showSocialDetails = true;
    }
    this.router.navigate(['./user-search'], {relativeTo: this.route});
  }

  closeDetails() {
    let url = this.location.path();
    let str = url.indexOf('/user-list/');
    if (str !== -1) {
      this.location.back();
    } else {
      this.showSocialDetails = false;
      this.router.navigate(['./'], {relativeTo: this.route});
    }
  }

  goToUserImage(image) {
    if (image) {
      this.router.navigate(['./user-image', {imageUrl: image}], {relativeTo: this.route});
    }
  }

  navigateToCustomPost(fab: FabContainer) {
    this.emitterService.socialDetailsScreen(false);
    this.router.navigate(['./custom-post'], {relativeTo: this.route});
    fab.close();
  }

  navigateToReviewPost(fab: FabContainer) {
    this.activeUser = this.activeUserService.user();
    this.router.navigate([`./post-review/`, this.userOrGuestAccount(), this.userOrGuestId()], {relativeTo: this.route});
  }

  navigateToMyDistinctList(fab: FabContainer) {
    this.router.navigate(['./product-post'], {relativeTo: this.route});
    fab.close();
  }

  userOrGuestAccount() {
    return this.activeUser.Id ? 'users' : 'guests';
  }

  userOrGuestId() {
    return this.activeUser.Id ? this.activeUser.Id : this.activeUser.UUID
  }

  onScroll() {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;
    this.socialPostData.getList(this.posts.length, this.limit, this.commentsPerPost, this.productPostsId)
      .subscribe(
        (res) => {
          this.isLoading = false;

          if (!res.length) {
            this.hasMore = false;
          }
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

  getSocialPostsGroup() {
    return this.socialPostData.selectedTypedAllPosts ? 'All Users' : 'Users I follow';
  }

  selectPostsGroup() {
    let popover = this.popoverCtrl.create(SocialGroupPopover, {
      showOptions: (status) => {
        let loading = this.loadingCtrl.create({
          content: 'Loading...'
        });
        loading.present();
        this.socialPostData.checkPostTypeStatus(status).subscribe(
          () => {
            loading.dismiss();
          },

          (err) => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: extractErrorMsg(err),
              buttons: ['OK']
            });
            alert.present();
          }
        );
      }
    }, {cssClass: 'social-group-popover'});
    popover.present();
  }

  backButton() {
    return this.location.back();
  }

  doRefresh(refresher) {
    this.socialPostData.getList(0, 10, 2, this.productPostsId, true)
      .subscribe(
        (res) => {
          refresher.complete();
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

  ngOnDestroy() {
    this.layoutCtrl.configure({
      'showSearchProduct': true,
      'showSocialPostsGroup': false,
      'manualBackButton': false,
      'showUserSearch': false,
      'showCreateSocialPostButton': false
    });
  }
}
