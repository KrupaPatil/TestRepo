import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from "../../../shared/services/layout.controller";
import { PageLevelService } from '../../../shared/services/page-level.service';

@Component({
  selector: 'gallery',
  templateUrl: 'gallery.html'
})
export class Gallery {

  private imageUrl: string;
  private cigarDetailsElement;

  constructor(private router: ActivatedRoute,
              private styleResolver: PageLevelService,
              private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Gallery'
    });
    this.router.params.subscribe(params => this.imageUrl = params.imageUrl);

    this.styleResolver.cigarDetailsSubPagesOnInit();
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200 && this.cigarDetailsElement) {
      this.cigarDetailsElement.style.display = 'block';
    }

    this.styleResolver.cigarDetailsSubPagesOnDestroy();
  }

}
