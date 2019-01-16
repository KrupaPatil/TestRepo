import * as _ from 'lodash';
import 'rxjs/add/operator/map';

import { throwError } from '../../../app/app.common';
import { MY_RATING_SORT_FIELD, NAME_SORT_FIELD, RATING_SORT_FIELD } from '../../../pages/my-cigars/my-cigars';
import { FavoritesItemModel } from '../../models/favorites-item.model';
import { JournalItemModel } from '../../models/journal-item.model';
import { WishListItemModel } from '../../models/wish-list-item.model';
import { ApiService } from '../../services/api.service';
import { DeviceService } from '../../services/device.service';
import { ApiResourceInterface } from './api-resource.interface';
import { BaseApiResource } from './base-api.resource';

export class CigarLogApiResource extends BaseApiResource implements ApiResourceInterface {

protected listName: string;
protected resource: JournalItemModel|FavoritesItemModel|WishListItemModel;
protected apiService: ApiService;
protected deviceService: DeviceService;

constructor(listName,
            resource,
            apiService,
            deviceService) {
  super();

  this.listName = listName;
  this.resource = resource;
  this.apiService = apiService;
  this.deviceService = deviceService;
}

  public getList(sort?, ascending?, take?, skip?) {
    let params = {};

      if (!_.isUndefined(sort) && !_.isNull(sort)) {
        params['SortBy'] = this._getSortBy(sort);
      }

      if (!_.isUndefined(ascending) && !_.isNull(ascending)) {
        params['SortDescending'] = !ascending;
      }

      if (!_.isUndefined(take) && !_.isNull(take)) {
        params['Take'] = take;
      }

      if (!_.isUndefined(skip) && !_.isNull(skip)) {
        params['Skip'] = skip;
      }

      return this.apiService
        .get('cigarlogs/list/' + this.listName + '?' + this._encodeQueryParams(params))
        .map(
          res => {
            let cigarLogs = res.json();
            let cigarLogsWithCigar = cigarLogs.filter(log => !!log.CigarDetails);

            if (cigarLogsWithCigar.length !== cigarLogs.length) {
              throwError(`Cigar logs without cigar: ${JSON.stringify(cigarLogs.filter(log => !log.CigarDetails))}`);
            }

            return this._mapCollection(this.resource, cigarLogsWithCigar);
          }
        );
  }

  public save(item) {
    if (item.Product.ProductId) {
        item.Product.LineId = null;
      } else if (item.Product.LineId) {
        item.Product.ProductId = null;
      }

      let body = {
        'UUID': this.deviceService.getDeviceID(),
        'ProductId': item.Product.ProductId,
        'LineId': item.Product.LineId,
        'List': this.listName,
        'Quantity': 1,
        'UserImageUrl': item.UserImageUrl,
        'Location': item.Location
      }

      if (item.RecognitionId) {
        body['RecognitionId'] = item.RecognitionId;
      }

      return this.apiService.post('cigarlogs', body).map(res => this._mapItem(this.resource, res.json()));
  }

  public update(item) {
    let data = _.pick(item, [
      'ProductId',
      'LineId',
      'List',
      'Quantity',
      'UserImageUrl',
      'Location',
      'Price',
      'Date'
      ]
    );

    data['UUID'] = this.deviceService.getDeviceID();

    return this.apiService.put('cigarlogs/' + item.Id, data)
      .map(res => this._mapItem(this.resource, res.json()));
  }

  public remove(id: number) {
    return this.apiService.delete('cigarlogs/' + id);
  }

  private _getSortBy(fieldName) {
    if (fieldName === NAME_SORT_FIELD) {
      return 'name';
    } else if (fieldName === RATING_SORT_FIELD) {
      return 'rating';
    } else if (fieldName === MY_RATING_SORT_FIELD) {
      return 'myrating';
    }

    return 'date';
  }

  public copyItem(logId, list) {
    return this.apiService.post(`cigarlogs/${logId}/copyto/${list}?DeleteOriginal=false`,{})
      .map(res => this._mapItem(this.resource, res.json()));
  }

}
