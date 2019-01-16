import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { matchByIdFn } from '../../app/app.common';
import { WISH_LIST, WishListItemModel } from '../models/wish-list-item.model';
import { UserWishListResource } from '../resources/user-wish-list.resource';
import { StorageService } from '../services/storage.service';

@Injectable()
export class WishListData {

  private _wishList = [];
  private resource;

  constructor(injector: Injector,
              private storageService: StorageService) {
    this.resource = injector.get(UserWishListResource);
  }

  public getList(sort?, ascending?, take?, skip?) {
    return new Observable((o: Observer<any>) => {
      return this.resource.getList(sort, ascending, take, skip)
        .subscribe(
          (res) => {
            this._wishList = res;

            o.next(this._wishList);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public get(id) {
    return new Observable((o: Observer<any>) => {
      let existing = _.find(this._wishList, matchByIdFn(id));

      if (existing) {
        o.next(existing);
        return o.complete();
      }

      this.getList().subscribe(
        (collection) => {
          let item = _.find(collection, {'Id': id});
          if (item) {
            o.next(item);
            return o.complete();
          } else {
            return o.error({
              status: 404
            });
          }
        },
        (err) => {
          return o.error(err);
        }
      );
    });
  }

  public create(data, logId?) {
    data.List = WISH_LIST;

    return new Observable((o: Observer<any>) => {
      this._productExistsInList(data.Product)
        .subscribe(
          existing => {
            if (!existing) {
              if (!logId) {
                return this.resource.create(new WishListItemModel(data))
                  .subscribe(
                    (res) => {
                      this.updateLoadedData(res);
                      o.next(res);
                      return o.complete();
                    });
              } else {
                return this.resource.copyItem(data, logId)
                  .subscribe(
                    (res) => {
                      this.storageService.clear().subscribe();
                      o.next(res);
                      return o.complete();
                    },
                    (err) => {
                      return o.error(err);
                    });
              }
            } else {
              o.next(existing);
              return o.complete();
            }
          },
          err => {
            return o.error(err);
          }
        );
    });
  }

  remove(item: WishListItemModel) {
    return new Observable((o: Observer<any>) => {
      _.remove(this._wishList, {'Id': item.Id} as any);

      return this.resource.remove(item)
        .subscribe(
          (res) => {
            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  update(item, data) {
    _.assignIn(item, data);

    return new Observable((o: Observer<any>) => {
      return this.resource.update(item)
        .subscribe(
          (res) => {
            this.updateLoadedData(res);

            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  updateLoadedProduct(product) {
    let wishListItem = _.find(this._wishList, (item) => item.Product.Id === product.Id);

    if (wishListItem) {
      _.assignIn(wishListItem.Product, product);
    }
  }

  deleteLoadedByProduct(product) {
    _.remove(this._wishList, (item) => item.Product.Id === product.Id);
  }

  private updateLoadedData(wishListItem) {
    let existing = _.has(wishListItem, 'Id') ? _.find(this._wishList, {'Id': wishListItem.Id}) : null;
    if (existing) {
      _.assignIn(existing, wishListItem);
      return existing;
    } else {
      this._wishList.push(wishListItem);
      return wishListItem;
    }
  }

  deleteLoadedData(journalItem) {
    _.remove(this._wishList, {Id: journalItem.Id});
  }

  private _productExistsInList(product) {
    return new Observable((o: Observer<any>) => {
      return this.getList().subscribe(
        collection => {
          o.next(_.find(collection, item => item.Product.Id === product.Id));
          return o.complete();
        },
        (err) => {
          if (err && err.status === 404) {
            o.next(false);
            return o.complete();
          } else {
            return o.error(err);
          }
        }
      );
    });
  }

}
