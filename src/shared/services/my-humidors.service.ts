import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { matchByIdFn } from '../../app/app.common';
import { HumidorCigarModel } from '../models/humidor-cigar.model';
import { HumidorModel } from '../models/humidor.model';
import { ProductModel } from '../models/product.model';
import { HumidorResource } from '../resources/humidor.resource';
import { StorageService } from '../services/storage.service';

@Injectable()
export class MyHumidorsService {

  public currentHumidors = [];
  public selectedHumidor;
  public selectedTempUnit: string;

  constructor(private humidorResource: HumidorResource,
              private storageService: StorageService) {
  }

  public loadHumidors() {
    return new Observable((o: Observer<any>) => {
      return this.humidorResource.getList()
        .subscribe(
          (res) => {
            this.currentHumidors = res;
            o.next(this.currentHumidors);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  updatingTempUnit(unit) {
    this.selectedTempUnit = unit;
  }

  convertTempToF(value) {
    return Math.round(value * 9 / 5 + 32);
  }

  convertTempToC(value) {
    return Math.round((value - 32) * 5 / 9);
  }

  public get(id) {
    return new Observable((o: Observer<any>) => {
      let existing = _.find(this.currentHumidors, matchByIdFn(id));
      if (existing) {
        this.selectedHumidor = existing;
        o.next(existing);
        return o.complete();
      }

      this.loadHumidors().subscribe(
        (collection) => {
          let item = _.find(collection, matchByIdFn(id));
          if (item) {
            this.selectedHumidor = item;
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

  public create(humidor: HumidorModel) {
    return new Observable((o: Observer<any>) => {
      return this.humidorResource.create(humidor)
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

  public update(humidor: HumidorModel, sensorTakeOver = false) {
    return new Observable((o: Observer<any>) => {
      return this.humidorResource.update(humidor, sensorTakeOver)
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

  public deleteHumidor(humidor: HumidorModel) {
    return new Observable((o: Observer<any>) => {
      return this.humidorResource.deleteHumidor(humidor)
        .subscribe(
          (res) => {
            _.remove(this.currentHumidors, {'Id': humidor.Id} as any);

            o.next(res);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public increaseCigarQuantity(humidor: HumidorModel, cigar: HumidorCigarModel, quantity?) {
    return new Observable((o: Observer<any>) => {
      humidor.increaseCigarQuantity(cigar.ProductId, quantity);

      return this.humidorResource.increaseCigarQuantity(humidor, cigar)
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

  public decreaseCigarQuantity(humidor: HumidorModel, cigar: HumidorCigarModel) {
    return new Observable((o: Observer<any>) => {
      humidor.decreaseCigarQuantity(cigar.ProductId);

      return this.humidorResource.decreaseCigarQuantity(humidor, cigar)
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

  public addCigar(humidor: HumidorModel, product: ProductModel, logId?) {
    return new Observable((o: Observer<any>) => {
      this._productExistsInHumidor(humidor, product)
        .subscribe(
          existing => {
            if (!existing) {
              if (!logId) {
                humidor.addCigar(product);
                return this.humidorResource.addCigar(humidor, product)
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
              } else {
                return this.humidorResource.copyItem(humidor, logId)
                  .subscribe(
                    (res) => {
                      this.storageService.clear().subscribe();
                      o.next(res);
                      return o.complete();
                    },
                    (err) => {
                      return o.error(err);
                    }
                  );
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

  public deleteCigar(humidor: HumidorModel, cigar: HumidorCigarModel) {
    return new Observable((o: Observer<any>) => {
      humidor.deleteCigar(cigar.ProductId);

      return this.humidorResource.deleteCigar(humidor, cigar)
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

  public sortCigarsInHumidor(humidor: HumidorModel, criteria, direction) {
    let existing = _.find(this.currentHumidors, matchByIdFn(humidor.Id));
    let cigars = existing.Cigars;
    let sorted = _.orderBy(cigars, cigar => this.getCriteria(cigar, criteria), direction);
    existing.Cigars = sorted;
  }

  getCriteria(cigar, criteria) {
    if (criteria == 'name') {
      return cigar.Product.Name;
    }
    if (criteria == 'date') {
      return cigar.Date;
    }
    if (criteria == 'my-rating') {
      return cigar.Product.MyRating;
    }
    if (criteria == 'avg-rating') {
      return cigar.Product.RatingSummary.AverageRating;
    }
  }

  public updateCigar(product) {
    return new Observable((o: Observer<any>) => {
      return this.humidorResource.updateCigar(this.selectedHumidor, product)
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

  getMeasurements(id, dateFrom?, dateTo?) {
    return new Observable((o: Observer<any>) => {
      return this.humidorResource.getMeasurements(id, dateFrom, dateTo)
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

  updateLoadedProduct(product) {
    _.each(this.currentHumidors, humidor => {
      let existingProduct = _.find(humidor.Cigars, {ProductId: product.Id}) as any;

      if (existingProduct && existingProduct.Product) {
        _.assignIn(existingProduct.Product, product);
      }
    });
  }

  deleteLoadedByProduct(product) {
    _.each(this.currentHumidors, humidor => {
      _.remove(humidor.Cigars, {ProductId: product.Id});
    });
  }

  updateLoadedData(humidor) {
    let existing = _.find(this.currentHumidors, matchByIdFn(humidor));
    if (existing) {
      _.assignIn(existing, humidor);
      return existing;
    } else {
      this.currentHumidors.unshift(humidor);

      return humidor;
    }
  }

  public deleteLoadedData(humidor) {
    _.remove(this.currentHumidors, {Id: humidor.Id});
  }

  private _productExistsInHumidor(humidor, product) {
    return new Observable((o: Observer<any>) => {
      o.next(_.find(humidor.Cigars, {ProductId: product.Id}));
      return o.complete();
    });
  }

}
