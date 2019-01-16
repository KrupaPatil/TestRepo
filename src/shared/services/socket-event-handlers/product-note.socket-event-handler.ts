import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { FavoritesData } from '../../data/favorites.data';
import { JournalData } from '../../data/journal.data';
import { WishListData } from '../../data/wish-list.data';
import { ProductNoteModel } from '../../models/product-note.model';
import { ProductModel } from '../../models/product.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { ProductDbResource } from '../../resources/db/product-db.resource';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class ProductNoteSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private productDbResource: ProductDbResource,
    private journalData: JournalData,
    private wishListData: WishListData,
    private favoritesData: FavoritesData,
    protected zone: NgZone
  ) {
    super(zone);
    this.resourceName = 'CigarUserNote';
  }

  created(socketMessage: SocketMessageModel) {
    return this._upsert(socketMessage);
  }

  deleted(id) {
    return new Observable((o: Observer<any>) => {
      o.next({});
      return o.complete();
    });
  }

  updated(socketMessage: SocketMessageModel) {
    return this._upsert(socketMessage);
  }

  private _upsert(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      let note = new ProductNoteModel(socketMessage.Data);
      let product = new ProductModel({ ProductId: socketMessage.Data.ProductId, LineId: socketMessage.Data.LineId });

      // Ignore the message if Id is not defined
      if (!product.Id) {
        o.next({});
        return o.complete();
      }

      this.productDbResource.getCollectionItem({ Id: product.Id })
        .subscribe(
          product => {
            product.MyNote = note;

            this._update(
              this.productDbResource.updateCollectionItem({ Id: product.Id }),
              this._loadedDataUpdate.bind(this),
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

  private _loadedDataUpdate(product) {
    this.journalData.updateLoadedProduct(product);
    this.favoritesData.updateLoadedProduct(product);
    this.wishListData.updateLoadedProduct(product);
  }

}
