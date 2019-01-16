import { Component } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';
import { ProductModel } from '../../../shared/models/product.model';
import { RouterService } from '../../../shared/services/router.service';
import { ActivatedRoute } from '@angular/router';
import { ProductReviewModel } from '../../../shared/models/product-review.model';
import { ProductReviewResource } from '../../../shared/resources/product-review.resource';
import { AlertController } from 'ionic-angular';
import { PageLevelService } from '../../../shared/services/page-level.service';
import * as _ from 'lodash';
import { extractErrorMsg } from "../../../app/app.common";

const DEFAULT_TAKE = 100;

@Component({
  selector: 'cigar-reviews',
  templateUrl: 'cigar-reviews.html'
})
export class CigarReviews {

  private cigar: ProductModel;
  private rating: number;
  private reviews: ProductReviewModel[] = [];
  private total: number = 0;
  private comments: string = 'with-comment';
  private withCommentOnly: boolean = true;

  private cigarDetailsElement;

  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private route: ActivatedRoute,
              private productReviewResource: ProductReviewResource,
              private styleResolver: PageLevelService,
              private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.route.parent.data.subscribe((data:any) => {
      this.cigar = data.cigar || data.cigarListItem.Product;

      if (!this.cigar) {
        this.router.navigateToRoot();
      }
    });

    this.rating = _.parseInt(this.route.snapshot.params['Rating']);

    this.getReviews(this.withCommentOnly, DEFAULT_TAKE, this.reviews.length);

    this.layoutCtrl.configure({
      'pageTitle': 'Reviews',
    });

    this.styleResolver.cigarDetailsSubPagesOnInit();
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200 && this.cigarDetailsElement) {
      this.cigarDetailsElement.style.display = 'block';
      this.layoutCtrl.configure({
        'pageTitle': this.cigar.Name,
        'showBackLink': true
      });
    }

    this.styleResolver.cigarDetailsSubPagesOnDestroy();
  }

  getReviews(withCommentOnly, take, skip, append = false) {
    this.productReviewResource.getList(this._getFilter(withCommentOnly), 'CreatedOn', false, take, skip)
      .subscribe(
        (res: ProductReviewModel[]) => {
          if (append) {
            this.reviews = this.reviews.concat(res);
          } else {
            this.reviews = res;
          }

          this.total = take + skip;
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

  toggleReviewsToDisplay() {
    this.withCommentOnly = !this.withCommentOnly;
    this.getReviews(this.withCommentOnly, DEFAULT_TAKE, 0);
  }

  loadMore() {
    this.getReviews(this.withCommentOnly, DEFAULT_TAKE, this.total, true);
  }

  private _getFilter(withCommentOnly) {
    let params = {};

    if (this.cigar.ProductId) {
      params['ProductId'] = this.cigar.ProductId;
    }

    if (this.cigar.LineId) {
      params['LineId'] = this.cigar.LineId;
    }

    if (_.isNumber(this.rating)) {
      params['Rating'] = this.rating;
    }

    if (_.isBoolean(withCommentOnly)) {
      params['WithCommentOnly'] = withCommentOnly;
    }

    return {
      params: params,
      filterFn: this._getFilterFn(params)
    };
  }

  private _getFilterFn(params) {
    return (item: ProductReviewModel) => {
      let match = true;

      if (params['ProductId']) {
        match = match && item.ProductId === params['ProductId'];
      }

      if (params['LineId']) {
        match = match && item.LineId === params['LineId'];
      }

      if (params['Rating']) {
        match = match && item.Rating === params['Rating'];
      }

      if (_.isBoolean(params['WithCommentOnly'])) {
        if (params['WithCommentOnly']) {
          match = match && _.isString(item.Comment) && item.Comment.length > 0;
        }
      }

      return match;
    };
  }

}
