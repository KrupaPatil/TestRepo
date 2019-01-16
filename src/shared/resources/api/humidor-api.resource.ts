import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { HumidorModel } from '../../models/humidor.model';
import { ApiService } from '../../services/api.service';
import { ProductModel } from '../../models/product.model';
import * as _ from 'lodash';

@Injectable()
export class HumidorApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public getList() {
    return this.apiService.get('humidors')
      .map(res => this._mapCollection(HumidorModel, res.json()));
  }

  public saveHumidor(data) {
    return this.apiService.post('humidors', {'Name': data.Name})
      .map(res => this._mapItem(HumidorModel, res.json()));
  }

  public updateHumidor(data, sensorTakeOver) {
    return this.apiService.put(`humidors/${data.Id}?sensorTakeOver=${sensorTakeOver}`, data)
      .map(res => this._mapItem(HumidorModel, res.json()));
  }

  public deleteHumidor(id) {
    return this.apiService.delete('humidors/' + id, {});
  }

  public updateCigarQuantity(humidorId, product: ProductModel, quantity) {
    return this.apiService.post('humidors/' + humidorId + '/cigar/' + product.ProductId + '/' + quantity, {})
      .map(res => this._mapItem(HumidorModel, res.json()));
  }

  public addCigar(humidor, product: ProductModel) {
    return this.apiService.post('humidors/' + humidor.Id + '/cigar/' + product.ProductId, {})
      .map(res => this._mapItem(HumidorModel, res.json()));
  }

  public copyItem(humidor, logId) {
    return this.apiService.post(`cigarlogs/${logId}/copyto/${humidor.Id}?DeleteOriginal=false`,{})
      .map(res => this._mapItem(HumidorModel, res.json()));
  }

  public deleteCigar(humidor, product: ProductModel) {
    return this.apiService.delete('humidors/' + humidor.Id + '/cigar/' + product.ProductId, {})
      .map(res => this._mapItem(HumidorModel, res.json()));
  }

  public updateCigar(item) {
    let data = _.pick(item, [
        'Location',
        'Price',
        'Date',
        'UserImageUrl'
      ]
    );

    return this.apiService.put('cigarlogs/' + item.Id, data)
      .map(res => this._mapItem(ProductModel, res.json()));
  }

  public getMeasurements(id, dateFrom, dateTo) {
    let dateFilter = dateFrom ? `?DateFrom=${dateFrom}&DateTill=${dateTo}` : '';
    return this.apiService.get(`humidors/${id}/sensor/measurements${dateFilter}`)
      .map(res => res.json());
  }
}
