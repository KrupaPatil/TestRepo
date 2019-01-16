import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { FavoritesData } from '../../data/favorites.data';
import { JournalData } from '../../data/journal.data';
import { WishListData } from '../../data/wish-list.data';
import { ProductModel } from '../../models/product.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { HumidorDbResource } from '../../resources/db/humidor-db.resource';
import { ProductDbResource } from '../../resources/db/product-db.resource';
import { TopRatedCigarsDbResource } from '../../resources/db/top-rated-cigars-db.resource';
import { TopScannedCigarsDbResource } from '../../resources/db/top-scanned-cigars-db.resource';
import { UserFavoritesDbResource } from '../../resources/db/user-favorites-db.resource';
import { UserJournalDbResource } from '../../resources/db/user-journal-db.resource';
import { UserWishListDbResource } from '../../resources/db/user-wish-list-db.resource';
import { MyHumidorsService } from '../my-humidors.service';
import { GLOBAL_CHANNEL, PERSONAL_CHANNEL } from '../socket-handler.service';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class ProductSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private productDbResource: ProductDbResource,
    private myHumidors: MyHumidorsService,
    private humidorDbResource: HumidorDbResource,
    private journalData: JournalData,
    private wishListData: WishListData,
    private favoritesData: FavoritesData,
    private userJournalDbResource: UserJournalDbResource,
    private userFavoritesDbResource: UserFavoritesDbResource,
    private userWishListDbResource: UserWishListDbResource,
    private topRatedCigarsDbResource: TopRatedCigarsDbResource,
    private topScannedCigarsDbResource: TopScannedCigarsDbResource,
    protected zone: NgZone
  ) {
    super(zone);
    this.resourceName = 'Product';
  }

  created(socketMessage: SocketMessageModel) {
    if (PERSONAL_CHANNEL === socketMessage.Channel) {
      let product = new ProductModel(socketMessage.Data);

      // Ignore the message if Id is not defined
      if (!product.Id) {
        return new Observable((o: Observer<any>) => {
          o.next({});
          return o.complete();
        });
      }

      return this._update(
        this.productDbResource.updateCollectionItem({ Id: product.Id }),
        null,
        product
      );
    } else {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }
  }

  deleted(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      this.getProductById(socketMessage.Data)
        .subscribe(
          (product: ProductModel) => {
            this._update(
              this.dbDataDelete.bind(this),
              this.loadedDataDelete.bind(this),
              product
            ).subscribe(
              () => {
                o.next({});
                return o.complete();
              },
              (err) => {
                return o.error(err);
              }
            );
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  updated(socketMessage: SocketMessageModel) {
    let product = new ProductModel(socketMessage.Data) as any;

    // Ignore the message if Id is not defined
    if (!product.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    // do not update personal data on global channel
    if (GLOBAL_CHANNEL === socketMessage.Channel) {
      product = _.omit(product, ['MyNote', 'MyRating']);
    }

    return this.update(product);
  }

  update(product: ProductModel) {
    return this._update(
      this.productDbResource.updateExistingCollectionItem({ Id: product.Id }, true),
      this.loadedDataUpdate.bind(this),
      product
    );
  }

  private getProductById(id) {
    return new Observable((o: Observer<any>) => {
      this.productDbResource.getCollectionItem({ Id: 'P-' + id })
        .subscribe(
          product => {
            o.next(product);
            o.complete();
          },
          () => {
            this.productDbResource.getCollectionItem({ Id: 'L-' + id })
              .subscribe(
                product => {
                  o.next(product);
                  o.complete();
                },
                err => {
                  o.error(err);
                }
              )
          }
        )
    });
  }

  private loadedDataUpdate(product) {
    this.myHumidors.updateLoadedProduct(product);

    this.journalData.updateLoadedProduct(product);
    this.favoritesData.updateLoadedProduct(product);
    this.wishListData.updateLoadedProduct(product);

    // TODO: notification, toprated and topscanned cigar
  }

  private dbDataDelete(product) {
    return Observable.create((o) => {
      this.subscribe(this.productDbResource.deleteCollectionItem({ Id: product.Id })(product), o, product);
    }).flatMap(() => {
      return Observable.create((o) => {
        this.subscribe(this.humidorDbResource.deleteCigar(product)(), o, product);
      });
    }).flatMap(() => {
      return Observable.create((o) => {
        this.subscribe(this.userJournalDbResource.deleteCollectionItemByProduct((item) => item.Product.Id === product.Id)(), o, product);
      });
    }).flatMap(() => {
      return Observable.create((o) => {
        this.subscribe(this.userFavoritesDbResource.deleteCollectionItemByProduct((item) => item.Product.Id === product.Id)(), o, product);
      });
    }).flatMap(() => {
      return Observable.create((o) => {
        this.subscribe(this.userWishListDbResource.deleteCollectionItemByProduct((item) => item.Product.Id === product.Id)(), o, product);
      });
    }).flatMap(() => {
      return Observable.create((o) => {
        this.subscribe(this.topRatedCigarsDbResource.deleteCollectionItem({ Id: product.Id })(product), o, product);
      });
    }).flatMap(() => {
      return Observable.create((o) => {
        this.subscribe(this.topScannedCigarsDbResource.deleteCollectionItem({ Id: product.Id })(product), o, product);
      });
    });
  }

  private loadedDataDelete(product) {
    this.myHumidors.deleteLoadedByProduct(product);

    this.journalData.deleteLoadedByProduct(product);
    this.favoritesData.deleteLoadedByProduct(product);
    this.wishListData.deleteLoadedByProduct(product);

    // TODO: notification, toprated and topscanned cigar
  }

  private subscribe(observableToSubscribe, o, product) {
    observableToSubscribe
      .subscribe(
        () => {
          o.next(product);
          o.complete();
        },
        () => {
          o.next(product);
          o.complete();
        }
      );
  }

}
