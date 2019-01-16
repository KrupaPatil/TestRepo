import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { removeMethods } from '../../../app/app.common';
import { BaseModel } from '../../models/base.model';
import { StorageService } from '../../services/storage.service';
import { SubmodelMapperService } from './submodel-mapper.service';

export class BaseDbResource {

  protected storageService: StorageService;
  protected documentName;
  protected model;
  protected submodelMapperService;
  protected submodelDetails;

  constructor(storageService: StorageService,
              documentName: string,
              model: BaseModel,
              submodelMapperService: SubmodelMapperService,
              submodelDetails: Array<any>) {
    this.storageService = storageService;
    this.documentName = documentName;
    this.model = model;
    this.submodelMapperService = submodelMapperService;
    this.submodelDetails = submodelDetails;
  }

  get(loadSubmodels: boolean = true) {
    return new Observable((o: Observer<any>) => {
      return this.storageService.get(this.documentName)
        .subscribe(
          (doc) => {
            if (doc === null) {
              return o.error({
                status: 404
              });
            } else {
              if (false === loadSubmodels) {
                o.next(doc);
                return o.complete();
              } else {
                return this.loadSubmodels(o, doc);
              }
            }
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  update(data: any) {
    let dataToStore = _.clone(data);
    return new Observable((o: Observer<any>) => {
      this.submodelMapperService.processSubmodels(dataToStore, this.submodelDetails)
        .subscribe(
          () => {
            this._processValues(dataToStore);
            this.storageService.set(this.documentName, dataToStore)
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

  exists() {
    return this.storageService.has(this.documentName);
  }

  protected loadSubmodels(o, doc, loadSubmodels = true) {
    if (!loadSubmodels) {
      o.next(doc);
      o.complete();
    } else {
      this.submodelMapperService.preloadSubmodels(doc, this.submodelDetails)
        .subscribe(
          () => {
            this._cast(doc)
              .subscribe(
                (d) => {
                  this.submodelMapperService.clearPreloadedSubmodels();

                  o.next(d);
                  return o.complete();
                },
                (err) => {
                  return o.error(err);
                }
              );
          },
          err => {
            return o.error(err);
          }
        );
    }
  }

  private _cast(doc) {
    return new Observable((o: Observer<any>) => {
      if (_.isArray(doc)) {
        let ret = [];

        if (_.isEmpty(doc)) {
          o.next(ret);
          return o.complete();
        }

        _.each(doc, (i) => {
          this.submodelMapperService.loadSubmodels(i, this.submodelDetails).subscribe(
            (d) => {
              ret.push(new this.model(d));

              if (doc.length == ret.length) {
                o.next(ret);
                return o.complete();
              }
            },
            (err) => {
              return o.error(err);
            }
          );
        });
      } else {
        this.submodelMapperService.loadSubmodels(doc, this.submodelDetails).subscribe(
          (d) => {
            o.next(new this.model(d));
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
      }
    });
  }

  private _processValues(data) {
    if (_.isArray(data)) {
      _.each(data, (item, index) => {
        data[index] = removeMethods(item);
      });
    } else {
      data = removeMethods(data);
    }
  }

}
