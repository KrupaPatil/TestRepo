import { Component, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from 'ionic-angular';
import { LayoutController } from '../../../shared/services/layout.controller';
import { ProductModel } from '../../../shared/models/product.model';
import { RouterService } from '../../../shared/services/router.service';
import { ProductReviewResource } from '../../../shared/resources/product-review.resource';
import { ProductReviewModel } from '../../../shared/models/product-review.model';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { PageLevelService } from '../../../shared/services/page-level.service';
import { createTemporaryId, extractErrorMsg } from '../../../app/app.common';
import { JournalData } from '../../../shared/data/journal.data';
import * as _ from 'lodash';


@Component({
  selector: 'my-rating',
  templateUrl: 'my-rating.html'
})
export class MyRating implements AfterViewInit {

  private cigar: ProductModel;
  private cigarListItem;
  private review: ProductReviewModel;
  private cigarDetailsElement;
  private scrollToBottom;
  private focusElement;
  private isHumidorCigar: boolean = false;

  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private alertCtrl: AlertController,
              private productReviewResource: ProductReviewResource,
              private location: Location,
              private styleResolver: PageLevelService,
              private route: ActivatedRoute,
              private myHumidorService: MyHumidorsService,
              private journalData: JournalData) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data: any) => {
      if (data.cigar && data.pageLevel == 3) {
        this.cigar = (_.filter(this.myHumidorService.selectedHumidor.Cigars, cigar => {
          this.isHumidorCigar = true;
          return cigar.Product.ProductId == data.cigar.ProductId
        }))[0].Product;
      } else {
        this.cigar = data.cigar || data.cigarListItem.Product;
      }

      this.cigarListItem = data.cigarListItem;
      if (!this.cigar) {
        this.router.navigateToRoot();
      }

      if (this.cigar.MyRating) {
        this.cigar.MyRating.ProductId = this.cigar.ProductId;
        this.cigar.MyRating.LineId = this.cigar.LineId;

        this.review = new ProductReviewModel(this.cigar.MyRating);
      } else {
        this.review = new ProductReviewModel({
          ProductId: this.cigar.ProductId,
          LineId: this.cigar.LineId,
        });
      }
    });

    this.layoutCtrl.configure({
      'pageTitle': 'Rating',
    });

    this.styleResolver.cigarDetailsSubPagesOnInit();
  }

  ngAfterViewInit() {
    if (window.innerWidth < 1200) {
      this.scrollToBottom = () => {
        setTimeout(() => {
          let scrollElementNumber = document.querySelectorAll('.page-level-2.show').length - 1;
          let scrollElement = <HTMLElement>document.querySelectorAll('.page-level-2.show')[scrollElementNumber];

          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.offsetHeight;
          }
        }, 500)
      };
      this.focusElement = document.querySelector('.my-rating-wrapper textarea');
      this.focusElement.addEventListener('focus', this.scrollToBottom, true);
    }
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200 && this.cigarDetailsElement) {
      this.cigarDetailsElement.style.display = 'block';
      this.layoutCtrl.configure({
        'pageTitle': this.cigar.Name,
        'showBackLink': true
      });
      this.focusElement.removeEventListener('focus', this.scrollToBottom, false);
    }

    this.styleResolver.cigarDetailsSubPagesOnDestroy();
  }

  submit(valid) {

    if (!valid) {
      return;
    }

    if (!this.cigarListItem && !this.isHumidorCigar) {
      this._addToJournalAndSetRating();
    } else {
      this._setRating()
    }
  }

  private _addToJournalAndSetRating() {
    let data = {Product: this.cigar};
    createTemporaryId(data);

    this.journalData.create(data)
      .subscribe(
        () => {
          this._setRating()
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  private _setRating() {
    this.productReviewResource.create(this.review)
      .subscribe(
        () => {
          this.cigar.MyRating = this.review;
          return this.location.back();
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
