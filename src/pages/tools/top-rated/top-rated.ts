import { Component } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';
import { AlertController } from 'ionic-angular';
import { TopRatedCigarsResource } from '../../../shared/resources/top-rated-cigars.resource'
import { RouterService } from '../../../shared/services/router.service';
import {TopCigarModel} from '../../../shared/models/top-cigar.model';
import { extractErrorMsg } from '../../../app/app.common';

@Component({
  selector: 'top-rated',
  templateUrl: 'top-rated.html'
})

export class TopRatedPage {

  private topRated: [TopCigarModel];
  private days = '7';
  private strength = '';
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private router: RouterService,
              private topRatedCigarsResource: TopRatedCigarsResource) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Top Rated',
      'showMenuLink': false,
      'showBackLink': false,
      'manualBackButton': true
    });
    this.getTopRatedCigars();

    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }
  }

  getTopRatedCigars() {
    this.topRatedCigarsResource.getList(this.days, this.strength)
      .subscribe(
        (topRated) => {
          this.topRated = topRated;
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

  goToDetails(cigar) {
    const id = "L-" + cigar.LineId;
    this.router.navigateByUrl('/cigar/' + id);
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = null;
    }

    this.layoutCtrl.configure({
      'manualBackButton': false
    });
  }

}
