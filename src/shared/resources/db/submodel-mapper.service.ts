import { Injectable, Injector } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { throwError } from '../../../app/app.common';

@Injectable()
export class SubmodelMapperService {

  public preloadedSubmodels = {};

  constructor(private injector: Injector) {
  }

  public loadSubmodels(model, submodelDetails) {
    return new Observable((o: Observer<any>) => {
      if (model._submodels && model._submodels.length > 0) {
        let counter = 0;
        _.each(model._submodels, submodelData => {
          let submodelMap = _.find(submodelDetails, {resource: submodelData.resource});

          if (submodelMap) {
            this._getSubmodels(submodelData.data, submodelMap)
              .subscribe(
                (collection) => {
                  counter++;

                  this._attachSubmodelToModel(model, collection, submodelMap);

                  if (model._submodels.length === counter) {
                    o.next(model);
                    return o.complete();
                  }
                },
                () => {
                  o.next(model);
                  return o.complete();
                }
              );
          } else {
            // this can be the case if some submodel is deleted meanwhile from resource but still exists in db
            counter++;
            if (model._submodels.length === counter) {
              o.next(model);
              return o.complete();
            }
          }
        });
      } else {
        o.next(model);
        return o.complete();
      }
    });
  }

  public processSubmodels(model, submodelDetails) {
    return new Observable((o: Observer<any>) => {
      if (!submodelDetails.length) {
        o.next({});
        return o.complete();
      }

      this._storeSubmodels(model, submodelDetails)
        .subscribe(
          () => {
            if (_.isArray(model)) {
              _.each(model, item => {
                this._transformSubmodelsToIds(item, submodelDetails);
              });
            } else {
              this._transformSubmodelsToIds(model, submodelDetails);
            }

            o.next({});
            return o.complete();
          },
          () => {
            o.next({});
            return o.complete();
          }
        );
    });
  }

  private _storeSubmodels(model, submodelDetails) {
    return new Observable((o: Observer<any>) => {
      let counter = 0;

      _.each(submodelDetails, details => {
        let dbResource = this.injector.get(details.dbResource);
        let submodels = [];

        if (!details.isCollection) {
          if (_.isArray(model)) {
            _.each(model, item => {
              submodels.push(this._getSubmodelFromModel(item, details));
            });
          } else {
            submodels.push(this._getSubmodelFromModel(model, details));
          }
        } else {
          if (_.isArray(model)) {
            _.each(model, item => {
              _.each(this._getSubmodelFromModel(item, details), submodel => {
                submodels.push(submodel);
              });
            });
          } else {
            _.each(this._getSubmodelFromModel(model, details), submodel => {
              submodels.push(submodel);
            });
          }
        }

        submodels = _.without(submodels, null);

        if (submodels.length) {
          let updateFn = dbResource.updateCollection();
          updateFn(submodels).subscribe(
            () => {
              counter++;
              if (counter == submodelDetails.length) {
                o.next({});
                return o.complete();
              }
            },
            (err) => {
              return o.error(err);
            }
          );
        } else {
          counter++;
          if (counter == submodelDetails.length) {
            o.next({});
            return o.complete();
          }
        }
      });
    });
  }

  private _getSubmodels(submodelData, submodelMap) {
    return new Observable((o: Observer<any>) => {
      let collection = [];
      let counter = 0;

      if (submodelData.length === 0) {
        o.next(collection);
        return o.complete();
      } else {
        _.each(submodelData, (id) => {
          this._getSubmodel(submodelMap, id)
            .subscribe(
              submodel => {
                counter++;

                if (submodel) {
                  collection.push(submodel);
                } else {
                  throwError(`Submodel not found: ${submodelMap.dbResource} - ${id}`);
                }

                if (counter === submodelData.length) {
                  o.next(collection);
                  return o.complete();
                }
              }
            );
        });
      }
    });
  }

  private _getSubmodel(submodelMap, id) {
    return new Observable((o: Observer<any>) => {
      let submodel = _.find(this.preloadedSubmodels[submodelMap.dbResource], {'Id': id});

      if (submodel) {
        o.next(submodel);
        o.complete();
      } else {
        this.injector.get(submodelMap.resource).get(id, false)
          .subscribe(
            submodel => {
              o.next(submodel);
              o.complete();
            },
            () => {
              o.next(null);
              o.complete();
            }
          );
      }
    });
  }

  /**
   * Preload submodels in order to prevent loading submodels for every item in models collection
   */
  public preloadSubmodels(doc, submodelDetails) {
    return new Observable((o: Observer<any>) => {
      if (_.isArray(doc)) {
        doc = _.head(doc);
      }

      if (_.isEmpty(doc) || _.isEmpty(doc._submodels)) {
        o.next(this.preloadedSubmodels);
        o.complete();
      } else {
        _.each(doc._submodels, submodelData => {
          let submodelMap = _.find(submodelDetails, {resource: submodelData.resource}) as any;

          if (submodelMap) {
            this.injector.get(submodelMap.dbResource).get(false)
              .subscribe(
                collection => {
                  this.preloadedSubmodels[submodelMap.dbResource] = collection;

                  if (doc._submodels.length === Object.keys(this.preloadedSubmodels).length) {
                    o.next(this.preloadedSubmodels);
                    o.complete();
                  }
                },
                err => {
                  o.next(err);
                }
              );
          } else {
            // this can be the case if some submodel is deleted meanwhile from resource but still exists in db
            // so just skip this one
            this.preloadedSubmodels[submodelData.resource] = [];

            if (doc._submodels.length === Object.keys(this.preloadedSubmodels).length) {
              o.next(this.preloadedSubmodels);
              o.complete();
            }
          }
        });
      }
    });
  }

  public clearPreloadedSubmodels() {
    this.preloadedSubmodels = {};
  }

  private _transformSubmodelsToIds(model, submodelDetails) {
    let submodels = [];

    _.each(submodelDetails, details => {
      let ids = [];

      if (details.isCollection) {
        _.each(this._getSubmodelFromModel(model, details), submodel => {
          ids.push(submodel.Id);
        });
      } else {
        ids.push(this._getSubmodelFromModel(model, details).Id);
      }

      submodels.push({
        data: ids,
        resource: details.resource
      });
    });

    model._submodels = submodels;
  }

  private _getSubmodelFromModel(model, submodelMap) {
    if (typeof submodelMap.get === "function") {
      return submodelMap.get(model);
    } else {
      return model[submodelMap.get];
    }
  }

  private _attachSubmodelToModel(model, collection, submodelMap) {
    let data = submodelMap.isCollection ? collection : _.head(collection);

    if (typeof submodelMap.set === "function") {
      submodelMap.set(model, data);
    } else {
      model[submodelMap.set] = data;
    }
  }

}
