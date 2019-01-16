import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { HumidorApiResource } from './api/humidor-api.resource';
import { HumidorDbResource } from './db/humidor-db.resource';
import { matchByIdFn } from '../../app/app.common';
import { HumidorCigarModel } from "../models/humidor-cigar.model";
import { ProductModel } from "../models/product.model";

@Injectable()
export class HumidorResource extends BaseResource {

  constructor(db: HumidorDbResource,
              api: HumidorApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getList() {
    return this._get(
      this.api.getList(),
      this.db.getCollection(null, 'CreatedOn', false, 1000, 0), // take all
      this.db.updateCollection(null, 'CreatedOn', false, 1000, 0)
    );
  }

  public create(data) {
    return this._upsertWithDeferredApiCall(
      this.api.saveHumidor(data),
      this.db.updateCollectionItem({'_Id': data._Id}),
      data
    );
  }

  public update(data, sensorTakeOver) {
    return this.api.updateHumidor(data, sensorTakeOver)
  }

  public deleteHumidor(data) {
    return this._deleteWithDeferredApiCall(
      this.api.deleteHumidor(data.Id),
      this.db.deleteCollectionItem({'Id': data.Id}),
      data
    );
  }

  public increaseCigarQuantity(humidor, cigar: HumidorCigarModel) {
    return this._upsertWithDeferredApiCall(
      this.api.updateCigarQuantity(humidor.Id, cigar.Product, cigar.Quantity),
      this.db.updateCollectionItem(matchByIdFn(humidor)),
      humidor
    );
  }

  public decreaseCigarQuantity(humidor, cigar: HumidorCigarModel) {
    return this._upsertWithDeferredApiCall(
      this.api.updateCigarQuantity(humidor.Id, cigar.Product, cigar.Quantity),
      this.db.updateCollectionItem(matchByIdFn(humidor)),
      humidor
    );
  }

  public addCigar(humidor, product: ProductModel) {
    return new Observable((o: Observer<any>) => {
      return this._fetchAndComplete(this.api.addCigar(humidor, product), this.db.updateCollectionItem(matchByIdFn(humidor)), o);
    });
  }

  public copyItem(humidor, logId) {
      return this.api.copyItem(humidor, logId)
  }

  public updateCigar(humidor, product: ProductModel) {
    return this._upsertWithDeferredApiCall(
      this.api.updateCigar(product),
      this.db.updateCollectionItem(matchByIdFn(humidor)),
      humidor
    );
  }

  public deleteCigar(humidor, cigar: HumidorCigarModel) {
    return new Observable((o: Observer<any>) => {
      return this._fetchAndComplete(this.api.deleteCigar(humidor, cigar.Product), this.db.updateCollectionItem(matchByIdFn(humidor)), o);
    });
  }

  public getMeasurements(id, dateFrom, dateTo) {
    return new Observable((o: Observer<any>) => {
      return this._fetchAndComplete(this.api.getMeasurements(id, dateFrom, dateTo), null, o);
    });
  }
}
