import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { throwError } from '../../../app/app.common';
import { BaseModel } from '../../models/base.model';
import { StorageService } from '../../services/storage.service';
import { BaseDbResource } from './base-db.resource';
import { SubmodelMapperService } from './submodel-mapper.service';

export class CollectionDbResource extends BaseDbResource {

  protected documentMeta;

  constructor(storageService: StorageService,
              documentName: string,
              model: BaseModel,
              submodelMapperService: SubmodelMapperService,
              submodelDetails: Array<any>) {
    super(storageService, documentName, model, submodelMapperService, submodelDetails);
    this.documentMeta = documentName + '-meta';
  }

  getCollection(filter, sort, ascending, take, skip) {
    return new Observable((o: Observer<any>) => {
      return this.get()
        .subscribe(
          (collection: any) => {
            if (!_.isArray(collection)) {
              throwError('Not a collection');
            }
            if (!this._isMetaApplied([filter, sort, ascending, take, skip])) {
              o.next(collection);
              return o.complete();
            }

            this.storageService.get(this.documentMeta)
              .subscribe(
                (meta) => {
                  // not loaded yet
                  if (meta === null) {
                    return o.error({
                      status: 404
                    });
                  }

                  let subsetKey = this._getSubsetKey(filter, sort, ascending);

                  if (!meta['allLoaded']) {
                    if (!meta['subset']
                      || !meta['subset'][subsetKey]
                      || meta['subset'][subsetKey] < take + skip) {
                      return o.error({
                        status: 404
                      });
                    }
                  }

                  if (filter && filter['filterFn']) {
                    collection = _.filter(collection, filter['filterFn']);
                  }

                  let sorted = _.orderBy(collection, (item) => _.get(item, sort, ''), ascending ? 'asc' : 'desc');
                  let res = _.slice(sorted, skip, skip + take);

                  o.next(res);
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

  getCollectionItem(params, loadSubmodels?) {
    return new Observable((o: Observer<any>) => {
      return this.get(false)
        .subscribe(
          (collection: any) => {
            if (!_.isArray(collection)) {
              throwError('Not a collection');
            }

            let item = _.find(collection, params);
            if (!item) {
              return o.error({
                status: 404
              });
            } else {
              return this.loadSubmodels(o, item, loadSubmodels);
            }
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  updateCollection(filter, sort, ascending, take, skip) {
    return (collection) => {
      return new Observable((o: Observer<any>) => {
        return this.get()
          .subscribe(
            (saved) => {
              let merged = !saved ? collection : _.unionBy(collection, saved, 'Id');
              return this._saveToDb(o, merged, filter, sort, ascending, take, skip);
            },
            (err) => {
              if (err && err.status === 404) {
                return this._saveToDb(o, collection, filter, sort, ascending, take, skip);
              } else {
                return o.error(err);
              }
            }
          );
      });
    };
  }

  updateCollectionItem(params, loadSubmodels = true) {
    return (item) => {
      return new Observable((o: Observer<any>) => {
        return this.get(loadSubmodels)
          .subscribe(
            (collection: [any]) => {
              let existing = params ? _.find(collection, params) : null;

              if (existing) {
                _.assignIn(existing, item);
                let index = _.indexOf(collection, existing);
                collection.splice(index, 1, existing);
                item = existing;
              } else {
                collection.push(item);
              }

              this.update(collection)
                .subscribe(
                  () => {
                    o.next(item);
                    return o.complete();
                  },
                  (err) => {
                    return o.error(err);
                  }
                );
            },
            (err) => {
              if (err && err.status === 404) {
                this.update([item])
                  .subscribe(
                    () => {
                      o.next(item);
                      return o.complete();
                    },
                    (error) => {
                      return o.error(error);
                    }
                  );
              } else {
                return o.error(err);
              }
            }
          );
      });
    };
  }

  updateExistingCollectionItem(params, loadSubmodels) {
    return (item) => {
      return new Observable((o: Observer<any>) => {
        return this.get(loadSubmodels)
          .subscribe(
            (collection: [any]) => {
              let existing = params ? _.find(collection, params) : null;

              if (existing) {
                _.assignIn(existing, item);
                let index = _.indexOf(collection, existing);
                collection.splice(index, 1, existing);
                item = existing;

                this.update(collection)
                  .subscribe(
                    () => {
                      o.next(item);
                      return o.complete();
                    },
                    (err) => {
                      return o.error(err);
                    }
                  );
              } else {
                return o.error({status: 404});
              }
            },
            (err) => {
              return o.error(err);
            }
          );
      });
    };
  }

  deleteCollectionItem(params) {
    return (item) => {
      return new Observable((o: Observer<any>) => {
        return this.get()
          .subscribe(
            (collection: [any]) => {
              let existing = params ? _.find(collection, params) : null;

              if (existing) {
                _.remove(collection, params);

                this.update(collection)
                  .subscribe(
                    () => {
                      o.next(item);
                      return o.complete();
                    },
                    (err) => {
                      return o.error(err);
                    }
                  );
              } else {
                o.next(null);
                return o.complete();
              }
            },
            (err) => {
              return o.error(err);
            }
          );
      });
    };
  }

  public deleteCollectionItemByProduct(params) {
    return () => {
      return new Observable((o: Observer<any>) => {
        return this.get()
          .subscribe(
            (collection: [any]) => {
              const removed = _.remove(collection, params);

              if (removed.length > 0) {
                this.update(collection)
                  .subscribe(
                    () => {
                      o.next(collection);
                      return o.complete();
                    },
                    (err) => {
                      return o.error(err);
                    }
                  );
              } else {
                o.next(collection);
                return o.complete();
              }
            },
            (err) => {
              return o.error(err);
            }
          );
      });
    };
  }

  private _saveToDb(o: Observer<any>, collection, filter?, sort?, ascending?, take?, skip?) {
    return this.update(collection)
      .subscribe(
        () => {
          if (!this._isMetaApplied([filter, sort, ascending, take, skip])) {
            o.next(collection);
            return o.complete();
          }

          this._saveMeta(collection, filter, sort, ascending, take, skip)
            .subscribe(
              (res) => {
                o.next(res);
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
  }

  private _saveMeta(collection, filter, sort, ascending, take, skip) {
    return new Observable((o: Observer<any>) => {
      this.storageService.get(this.documentMeta)
        .subscribe(
          (meta) => {
            if (!meta) {
              meta = {
                'subset': {}
              };
            }
            meta['allLoaded'] = !filter && collection.length < (take + skip);

            if (!meta['allLoaded']) {
              meta['subset'][this._getSubsetKey(filter, sort, ascending)] = take + skip;
            } else {
              delete meta['subset'];
            }

            return this.storageService.set(this.documentMeta, meta)
              .subscribe(
                (res) => {
                  o.next(res);
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

  private _getFilterKey(filter) {
    if (filter && filter['params']) {
      return _.map(filter['params'], (value, key) => {
        return key + '=' + value;
      }).join(';');
    } else {
      return '';
    }
  }

  private _getSortKey(sort, ascending) {
    if (sort) {
      return sort + '=' + (ascending ? 'asc' : 'desc');
    } else {
      return '';
    }
  }

  private _getSubsetKey(filter, sort, ascending) {
    let key = '';

    key += this._getFilterKey(filter);
    key += key.length > 0 ? ';' : '';
    key += this._getSortKey(sort, ascending);

    return key;
  }

  private _isMetaApplied(params: any[]) {
    let applied = false;

    _.each(params, param => {
      if (!_.isUndefined(param) && !_.isNull(param)) {
        applied = true;
      }
    });

    return applied;
  }

}
