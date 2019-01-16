import { Injectable } from '@angular/core';
import { WISH_LIST, WishListItemModel } from '../../models/wish-list-item.model';
import { ApiService } from '../../services/api.service';
import { DeviceService } from '../../services/device.service';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import * as _ from 'lodash';
import { CigarLogApiResource } from './cigar-log-api.resource';

@Injectable()
export class UserWishListApiResource extends BaseApiResource implements ApiResourceInterface {

  protected listName = WISH_LIST;
  protected resource = WishListItemModel;

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
