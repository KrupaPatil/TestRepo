import { Injectable } from '@angular/core';
import { JOURNAL_LIST, JournalItemModel } from '../../models/journal-item.model';
import { ApiService } from '../../services/api.service';
import { DeviceService } from '../../services/device.service';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import * as _ from 'lodash';
import { CigarLogApiResource } from './cigar-log-api.resource';

@Injectable()
export class UserJournalApiResource extends BaseApiResource implements ApiResourceInterface {

  protected listName = JOURNAL_LIST;
  protected resource = JournalItemModel;

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
