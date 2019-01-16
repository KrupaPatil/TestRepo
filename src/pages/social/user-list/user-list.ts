import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Title} from '@angular/platform-browser';
import { LayoutController } from '../../../shared/services/layout.controller';
import { EmitterService } from '../../../shared/services/emitter.service';
import { RouterService } from '../../../shared/services/router.service';
import { PageLevelService } from '../../../shared/services/page-level.service';


@Component({
  selector: 'user-list',
  templateUrl: 'user-list.html'
})

export class UserList {

  private userList = [];
  private title: string;

  constructor(private layoutCtrl: LayoutController,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private router: RouterService,
              private pageLevelService: PageLevelService,
              private emitterService: EmitterService) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data:any) => {
      this.userList = data.list;
      if (this.userList[0]) {
        this.title = `${this.userList[0].List} list`;
        this.titleService.setTitle(this.title);
      }
      if (window.innerWidth > 1200) {
        this.emitterService.socialDetailsScreen(false);
      }
    });

    this.layoutCtrl.configure({
      'pageTitle': this.title,
      'showBackLink': false,
      'showSocialPostsGroup': false,
      'manualBackButton': true
    });

    this.pageLevelService.userProfilePagesOnInit();
  }

  navigateToProduct(cigar) {
    let product;
    if (cigar.ProductId) {
      product = "P-" + cigar.ProductId;
    } else {
      product = "L-" + cigar.LineId;
    }

    if (product) {
      this.router.navigate(['/social/cigar/' + product]);
    }
  }

  ngOnDestroy() {
    this.pageLevelService.userProfilePagesOnDestroy();
  }
}
