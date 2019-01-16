import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// Currently no real storage is used. Data is stored in object and used just in run-time
export class StorageService {

  protected storage = {};

  constructor() {
  }

  public init() {
    return new Observable((o: Observer<any>) => {
      this.storage = {};
      o.next(true);
      return o.complete();
    });
  }

  get(id) {
    return new Observable((o: Observer<any>) => {
      o.next(_.has(this.storage, id) ? this.storage[id] : null);
      return o.complete();
    });
  }

  has(id) {
    return new Observable((o: Observer<any>) => {
      o.next(_.has(this.storage, id));
      return o.complete();
    });
  }

  set(id, data) {
    return new Observable((o: Observer<any>) => {
      this.storage[id] = data;
      o.next(data);
      return o.complete();
    });
  }

  clear() {
    return new Observable((o: Observer<any>) => {
      this.storage = {};
      o.next(true);
      return o.complete();
    });
  }

  forEach(callback) {
    return _.each(this.storage, callback);
  }

  hasGuestData() {
    const relevantKeys = [
      'humidors',
      'product-shapes',
      'products',
      'user-journal',
      'user-wish-list',
      'user-favorites'
    ];

    return _.some(
      this.storage,
      (value, key) => _.includes(relevantKeys, key) && !_.isEmpty(value)
    );
  }

}
