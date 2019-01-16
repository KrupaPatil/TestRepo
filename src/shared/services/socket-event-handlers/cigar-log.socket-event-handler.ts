import { Injectable, Injector, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { FavoritesData } from '../../data/favorites.data';
import { JournalData } from '../../data/journal.data';
import { WishListData } from '../../data/wish-list.data';
import { FAVORITES_LIST, FavoritesItemModel } from '../../models/favorites-item.model';
import { JOURNAL_LIST, JournalItemModel } from '../../models/journal-item.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { WISH_LIST, WishListItemModel } from '../../models/wish-list-item.model';
import { UserFavoritesDbResource } from '../../resources/db/user-favorites-db.resource';
import { UserJournalDbResource } from '../../resources/db/user-journal-db.resource';
import { UserWishListDbResource } from '../../resources/db/user-wish-list-db.resource';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class CigarLogSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  private cigarListItem;
  private dbResource;
  private dataStore;

  constructor(
    private injector: Injector,
    protected zone: NgZone
  ) {
    super(zone);
  }

  created(socketMessage: SocketMessageModel) {
    this.init(socketMessage.Data);

    // Ignore the message if Id is not defined
    if (!this.cigarListItem.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.dbResource.updateCollectionItem({Id: this.cigarListItem.Id}, true),
      this.dataStore.updateLoadedData.bind(this.dataStore),
      this.cigarListItem
    );
  }

  deleted(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      this.getCigarLogById(socketMessage.Data)
        .subscribe(
          (item) => {
            this.init(item);

            this._update(
              this.dbResource.deleteCollectionItem({Id: this.cigarListItem.Id}),
              this.dataStore.deleteLoadedData.bind(this.dataStore),
              this.cigarListItem
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
    this.init(socketMessage.Data);

    // Ignore the message if Id is not defined
    if (!this.cigarListItem.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.dbResource.updateCollectionItem({Id: this.cigarListItem.Id}, true),
      this.dataStore.updateLoadedData.bind(this.dataStore),
      this.cigarListItem
    );
  }

  private init(data) {
    if (JOURNAL_LIST === data.List) {
      this.cigarListItem = new JournalItemModel(data);
      this.dbResource = this.injector.get(UserJournalDbResource);
      this.dataStore = this.injector.get(JournalData);
      this.resourceName = 'JournalItem';
    } else if (FAVORITES_LIST === data.List) {
      this.cigarListItem = new FavoritesItemModel(data);
      this.dbResource = this.injector.get(UserFavoritesDbResource);
      this.dataStore = this.injector.get(FavoritesData);
      this.resourceName = 'FavoritesItem';
    } else if (WISH_LIST === data.List) {
      this.cigarListItem = new WishListItemModel(data);
      this.dbResource = this.injector.get(UserWishListDbResource);
      this.dataStore = this.injector.get(WishListData);
      this.resourceName = 'WishListItem';
    }
  }

  private getCigarLogById(id) {
    return new Observable((o: Observer<any>) => {
      this.injector.get(UserJournalDbResource).getCollectionItem({Id: id})
        .subscribe(
          item => {
            o.next(item);
            o.complete();
          },
          err => {
            this.injector.get(UserFavoritesDbResource).getCollectionItem({Id: id})
              .subscribe(
                item => {
                  o.next(item);
                  o.complete();
                },
                err => {
                  this.injector.get(UserWishListDbResource).getCollectionItem({Id: id})
                    .subscribe(
                      item => {
                        o.next(item);
                        o.complete();
                      },
                      err => {
                        o.error(err);
                      }
                    );
                }
              );
          }
        );
    });
  }

}
