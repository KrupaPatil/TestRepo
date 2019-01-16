import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from '../../../shared/services/layout.controller';
import { EmitterService } from '../../../shared/services/emitter.service';
import { SocialPostModel } from '../../../shared/models/social-post.model';
import { RouterService } from '../../../shared/services/router.service';
import { PageLevelService } from '../../../shared/services/page-level.service';

@Component({
  selector: 'user-posts',
  templateUrl: 'user-posts.html'
})

export class UserPosts {

  private posts: [SocialPostModel]
  constructor(private layoutCtrl: LayoutController,
              private route: ActivatedRoute,
              private pageLevelService: PageLevelService,
              private router: RouterService,
              private emitterService: EmitterService) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'User Posts',
      'showBackLink': false,
      'showSocialPostsGroup': false
    });

    this.route.data.subscribe((data:any) => {
      this.posts = data.posts;
      if (window.innerWidth > 1200) {
        this.emitterService.socialDetailsScreen(false);
      }
    });
    this.pageLevelService.userProfilePagesOnInit();
  }

  navigateToProduct(post) {
    let product;
    if (post.ProductId) {
      product = "P-" + post.ProductId;
    } else {
      product = "L-" + post.LineId;
    }
    if (product) {
      this.router.navigate(['./social/cigar/' + product]);
    }
  }

  ngOnDestroy() {
    this.pageLevelService.userProfilePagesOnDestroy();
  }
}
