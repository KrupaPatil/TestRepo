import { Component } from '@angular/core';
import { LayoutController } from "../../../shared/services/layout.controller";
import { AlertController } from 'ionic-angular';
import { TopScannedCigarsResource } from '../../../shared/resources/top-scanned-cigars.resource'
import { RouterService } from "../../../shared/services/router.service";
import {TopCigarModel} from '../../../shared/models/top-cigar.model';
import { extractErrorMsg } from "../../../app/app.common";

@Component({
  selector: 'top-scanned',
  templateUrl: 'top-scanned.html'
})

export class TopScannedPage {

  private topScanned: [TopCigarModel];
  private days: string = '7';
  private strength: string = '';
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private router: RouterService,
              private topScannedCigarsResource: TopScannedCigarsResource) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Top Scanned',
      'showMenuLink': false,
      'showBackLink': false,
      'manualBackButton': true
    });
    this.getTopScannedCigars();

    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }
  }

  getTopScannedCigars() {
    this.topScannedCigarsResource.getList(this.days, this.strength)
      .subscribe(
        (topScanned) => {
          this.topScanned = topScanned;
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
