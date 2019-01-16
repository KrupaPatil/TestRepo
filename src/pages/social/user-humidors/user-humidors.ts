import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from '../../../shared/services/layout.controller';
import { EmitterService } from '../../../shared/services/emitter.service';
import { RouterService } from '../../../shared/services/router.service';
import { PageLevelService } from '../../../shared/services/page-level.service';


@Component({
  selector: 'user-humidors',
  templateUrl: 'user-humidors.html'
})

export class UserHumidors {

  private humidors;
  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private pageLevelService: PageLevelService,
              private activatedRoute: ActivatedRoute,
              private emitterService: EmitterService) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'User Humidors',
      'showBackLink': false,
      'showSocialPostsGroup': false,
      'manualBackButton': true
    });

    this.activatedRoute.data.subscribe((data:any) => {
      this.humidors = data.humidors;
      if (window.innerWidth > 1200) {
        this.emitterService.socialDetailsScreen(false);
      }
    });

    this.pageLevelService.userProfilePagesOnInit();
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
    this.pageLevelService.userProfilePagesOnDestroy();
  }
}
