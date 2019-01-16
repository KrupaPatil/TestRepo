import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { matchByIdFn } from '../../app/app.common';
import { JOURNAL_LIST, JournalItemModel } from '../models/journal-item.model';
import { UserJournalResource } from '../resources/user-journal.resource';
import { StorageService } from '../services/storage.service';

@Injectable()
export class JournalData {

  private _journals = [];
  private resource;

  constructor(injector: Injector,
              private storageService: StorageService) {
    this.resource = injector.get(UserJournalResource);
  }

  public getList(sort?, ascending?, take?, skip?) {
    return new Observable((o: Observer<any>) => {
      return this.resource.getList(sort, ascending, take, skip)
        .subscribe(
          (res) => {
            this._journals = res;

            o.next(this._journals);
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
      let existing = _.find(this._journals, matchByIdFn(id));

      if (existing) {
        o.next(existing);
        return o.complete();
      }

      this.getList().subscribe(
        (collection) => {
          let item = _.find(collection, matchByIdFn(id));
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
    data.List = JOURNAL_LIST;

    return new Observable((o: Observer<any>) => {
      this._productExistsInList(data.Product)
        .subscribe(
          existing => {
            if (!existing) {
              if (!logId) {
                return this.resource.create(new JournalItemModel(data))
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

  remove(item: JournalItemModel) {
    return new Observable((o: Observer<any>) => {
      if (item['_Id']) {
        _.remove(this._journals, {'_Id': item['_Id']});
      } else {
        _.remove(this._journals, {'Id': item.Id} as any);
      }

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
    let journalItem = _.find(this._journals, (item) => item.Product.Id === product.Id);

    if (journalItem) {
      _.assignIn(journalItem.Product, product);
    }
  }

  deleteLoadedByProduct(product) {
    _.remove(this._journals, (item) => item.Product.Id === product.Id);
  }

  updateLoadedData(journalItem) {
    let existing = _.has(journalItem, 'Id') ? _.find(this._journals, {'Id': journalItem.Id}) : null;
    if (existing) {
      _.assignIn(existing, journalItem);
      return existing;
    } else {
      this._journals.unshift(journalItem);
      return journalItem;
    }
  }

  deleteLoadedData(journalItem) {
    _.remove(this._journals, {Id: journalItem.Id});
  }

  reportBadResult(recordId) {
    return new Observable((o: Observer<any>) => {
      this.resource.reportBadResult(recordId).subscribe(
        res => {
          o.next(res);
          return o.complete();
        },
        (err) => {
          return o.error(err);
        })
    });
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
