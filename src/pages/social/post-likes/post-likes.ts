import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from "../../../shared/services/layout.controller";
import { EmitterService } from "../../../shared/services/emitter.service";

@Component({
  selector: 'post-likes',
  templateUrl: 'post-likes.html'
})
export class PostLikes {

  private usersLiked: string;

  constructor(private router: ActivatedRoute,
              private emitterService: EmitterService,
              private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Post Likes',
      'showMenuLink': false,
      'manualBackButton': true,
      'showSocialPostsGroup': false
    });

    this.router.data.subscribe((data:any) => {
      this.usersLiked = data.comments;
    });

    if (window.innerWidth > 1200) {
      this.emitterService.socialDetailsScreen(false);
    }
  }
}
