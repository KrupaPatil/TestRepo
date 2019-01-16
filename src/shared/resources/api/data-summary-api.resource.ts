import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';
import { DataSummaryModel} from '../../models/data-summary.model';

@Injectable()
export class DataSummaryApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public dataSummary() {
    return this.apiService.get('datasummary')
      .map(res => this._mapItem(DataSummaryModel, res.json()))
      .catch(error => {
        return Observable.of(null);
        });
  }
}
