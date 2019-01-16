import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from "../../../shared/services/layout.controller";

@Component({
  selector: 'user-image',
  templateUrl: 'user-image.html'
})
export class UserImage {

  private imageUrl: string;

  constructor(private router: ActivatedRoute,
              private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'User Picture',
      'manualBackButton': true,
      'showSocialPostsGroup': false
    });
    this.router.params.subscribe(params => this.imageUrl = params.imageUrl);
  }
}
