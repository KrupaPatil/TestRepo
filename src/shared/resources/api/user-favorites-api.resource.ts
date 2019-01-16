import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DeviceService } from '../../services/device.service';
import { FAVORITES_LIST, FavoritesItemModel } from '../../models/favorites-item.model';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import * as _ from 'lodash';
import { CigarLogApiResource } from './cigar-log-api.resource';

@Injectable()
export class UserFavoritesApiResource extends BaseApiResource implements ApiResourceInterface {

  protected listName = FAVORITES_LIST;
  protected resource = FavoritesItemModel;

  constructor(private apiService: ApiService,
              private deviceService: DeviceService) {
    super();

    // extending CigarLogApiResource caused module loading problems
    _.assignIn(
      this,
      new CigarLogApiResource(this.listName, this.resource, apiService, deviceService)
    );
  }

}
