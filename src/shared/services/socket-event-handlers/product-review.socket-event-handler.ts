import { Injectable, Injector, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { FavoritesData } from '../../data/favorites.data';
import { JournalData } from '../../data/journal.data';
import { WishListData } from '../../data/wish-list.data';
import { ProductRatingModel } from '../../models/product-rating.model';
import { ProductReviewModel } from '../../models/product-review.model';
import { ProductModel } from '../../models/product.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { ProductDbResource } from '../../resources/db/product-db.resource';
import { ProductReviewResource } from '../../resources/product-review.resource';
import { ActiveUserService } from '../active-user.service';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { ProductSocketEventHandler } from './product.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class ProductReviewSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private productReviewResource: ProductReviewResource,
    private productDbResource: ProductDbResource,
    private journalData: JournalData,
    private wishListData: WishListData,
    private favoritesData: FavoritesData,
    private injector: Injector,
    protected zone: NgZone,
    private productSocketEventHandler: ProductSocketEventHandler
  ) {
    super(zone);
    this.resourceName = 'CigarRating';
  }

  created(socketMessage: SocketMessageModel) {
    let observers = this._getProductRatingUpdateObservers(socketMessage);
    let productReview = new ProductReviewModel(socketMessage.Data);
    let loadedDataUpdateFn = null;
    let updateProductLocalDb = false;

    // if user owns rated cigar we need to update cigar
    if (socketMessage.Data.UserId === this.injector.get(ActiveUserService).user().Id) {
      loadedDataUpdateFn = this._loadedDataUpdate.bind(this);
      updateProductLocalDb = true;
    }

    // Ignore the message if Id is not defined
    if (!productReview.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    observers.push(
      this._update(
        this.productReviewResource.dbUpdateFn({ Id: productReview.Id }, updateProductLocalDb),
        loadedDataUpdateFn,
        productReview
      )
    );

    return Observable.concat(...observers);
  }

  deleted(socketMessage: SocketMessageModel) {
    let observers = this._getProductRatingUpdateObservers(socketMessage);

    if (observers.length) {
      return Observable.concat(...observers);
    } else {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }
  }

  updated(socketMessage: SocketMessageModel) {
    let observers = this._getProductRatingUpdateObservers(socketMessage);
    let productReview = new ProductReviewModel(socketMessage.Data);
    let loadedDataUpdateFn = null;
    let updateProductLocalDb = false;

    // if user owns rated cigar we need to update cigar
    if (socketMessage.Data.UserId === this.injector.get(ActiveUserService).user().Id) {
      loadedDataUpdateFn = this._loadedDataUpdate.bind(this);
      updateProductLocalDb = true;
    }

    // Ignore the message if Id is not defined
    if (!productReview.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    observers.push(
      this._update(
        this.productReviewResource.dbUpdateFn({ Id: productReview.Id }, updateProductLocalDb),
        loadedDataUpdateFn,
        productReview
      )
    );

    return Observable.concat(...observers);
  }

  private _loadedDataUpdate(productReview) {
    let product = new ProductModel({ ProductId: productReview.ProductId, LineId: productReview.LineId });

    this.productDbResource.getCollectionItem({ Id: product.Id })
      .subscribe(
        product => {
          product.MyRating = productReview;

          this.journalData.updateLoadedProduct(product);
          this.favoritesData.updateLoadedProduct(product);
          this.wishListData.updateLoadedProduct(product);
        },
        () => { }
      );
  }

  private _getProductRatingUpdateObservers(socketMessage: SocketMessageModel) {
    let observers = [];
    let productData, lineData;

    if (socketMessage.Data && socketMessage.Data.Extra) {
      if (socketMessage.Data.Extra.ProductId) {
        let productRating = new ProductRatingModel({
          "AverageRating": socketMessage.Data.Extra.ProductAverageRating,
          "RatingCount": socketMessage.Data.Extra.ProductRatingCount,
          "Rated5": socketMessage.Data.Extra.ProductRated5,
          "Rated4": socketMessage.Data.Extra.ProductRated4,
          "Rated3": socketMessage.Data.Extra.ProductRated3,
          "Rated2": socketMessage.Data.Extra.ProductRated2,
          "Rated1": socketMessage.Data.Extra.ProductRated1
        });

        productData = new ProductModel({
          ProductId: socketMessage.Data.Extra.ProductId,
          LineId: socketMessage.Data.Extra.LineId,
          RatingSummary: productRating
        });
      }

      if (socketMessage.Data.Extra.LineId) {
        let lineRating = new ProductRatingModel({
          "AverageRating": socketMessage.Data.Extra.LineAverageRating,
          "RatingCount": socketMessage.Data.Extra.LineRatingCount,
          "Rated5": socketMessage.Data.Extra.LineRated5,
          "Rated4": socketMessage.Data.Extra.LineRated4,
          "Rated3": socketMessage.Data.Extra.LineRated3,
          "Rated2": socketMessage.Data.Extra.LineRated2,
          "Rated1": socketMessage.Data.Extra.LineRated1
        });

        lineData = new ProductModel({
          LineId: socketMessage.Data.Extra.LineId,
          RatingSummary: lineRating
        });
      }

      delete socketMessage.Data.Extra;
    }

    if (productData) {
      observers.push(this.productSocketEventHandler.update(productData));
    }

    if (lineData) {
      observers.push(this.productSocketEventHandler.update(lineData));
    }

    return observers;
  }

}
