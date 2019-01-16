import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from '../../../shared/services/layout.controller';
import { EmitterService } from '../../../shared/services/emitter.service';
import { PageLevelService } from '../../../shared/services/page-level.service';

@Component({
  selector: 'user-follows',
  templateUrl: 'user-follows.html'
})

export class UserFollows {

  private pageTitle;
  private list;
  constructor(private layoutCtrl: LayoutController,
              private pageLevelService: PageLevelService,
              private activatedRoute: ActivatedRoute,
              private emitterService: EmitterService) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data:any) => {
      this.pageTitle = data.title;

      if (this.pageTitle === 'Followers' ) {
        this.list = data.follows.filter((user) => user.FollowsFrom !== null);
      } else {
        this.list = data.follows.filter((user) => user.FollowedOn !== null);
      }

      if (window.innerWidth > 1200) {
        this.emitterService.socialDetailsScreen(false);
      }
    });

    this.layoutCtrl.configure({
      'pageTitle': `User ${this.pageTitle}`,
      'showBackLink': false,
      'showSocialPostsGroup': false,
      'manualBackButton': true
    });

    this.pageLevelService.userProfilePagesOnInit();
  }

  ngOnDestroy() {
    this.pageLevelService.userProfilePagesOnDestroy();
    this.layoutCtrl.configure({
      'pageTitle': `User Profile`
    });
  }
}
