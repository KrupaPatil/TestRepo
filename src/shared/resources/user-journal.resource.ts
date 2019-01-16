import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { UserJournalDbResource } from './db/user-journal-db.resource';
import { UserJournalApiResource } from './api/user-journal-api.resource';
import { SearchableResourceInterface } from './searchable-resource.interface';
import * as _ from 'lodash';
import { matchByIdFn } from '../../app/app.common';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';

@Injectable()
export class UserJournalResource extends BaseResource implements SearchableResourceInterface {

  constructor(db: UserJournalDbResource,
              api: UserJournalApiResource,
              injector: Injector,
              private apiService: ApiService) {
    super(db, api, injector);
  }

  public getList(sort?, ascending?, take?, skip?) {
    return this._get(
      this.api.getList(sort, ascending, take, skip),
      this.db.getCollection(null, sort, ascending, take, skip),
      this.db.updateCollection(null, sort, ascending, take, skip)
    );
  }

  public getItemByProductId(productId) {
    return new Observable((o: Observer<any>) => {
      this.db.exists()
        .subscribe(
          exists => {
            if (!exists) {
              this.getList()
                .subscribe(
                  () => {
                    this.db.getCollectionItem({Product: {Id: productId}})
                      .subscribe(
                        item => {
                          o.next(item);
                          o.complete();
                        },
                        err => {
                          o.error(err);
                        }
                      );
                  },
                  (err) => {
                    o.error(err);
                  }
                );
            } else {
              this.db.getCollectionItem({Product: {Id: productId}})
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
          },
          err => {
            o.error(err);
          }
        );
    });
  }

  public search(term, skip, take) {
    return this.getList()
      .map(
        collection => _.filter(collection, item => {
          return _.includes(_.toLower(item.Product.Name), _.toLower(term));
        }).slice(skip, skip + take)
      );
  }

  public create(data) {
    return this._upsertWithDeferredApiCall(
      this.api.save(data),
      this.db.updateCollectionItem({'_Id': data._Id}),
      data
    );
  }

  public remove(data) {
    return this._deleteWithDeferredApiCall(
      this.api.remove(data.Id),
      this.db.deleteCollectionItem(matchByIdFn(data)),
      data
    );
  }

  public update(item) {
    return this._upsertWithDeferredApiCall(
      this.api.update(item),
      this.db.updateCollectionItem(matchByIdFn(item)),
      item
    );
  }

  public reportBadResult(recordId) {
    return this.apiService.post('recognition/' + recordId + '/wrong',{});
  }

  public copyItem(item, logId) {
    return this._upsertWithDeferredApiCall(
      this.api.copyItem(logId, item.List),
      this.db.updateCollectionItem({'_Id': item._Id}),
      item
    );
  }
}
