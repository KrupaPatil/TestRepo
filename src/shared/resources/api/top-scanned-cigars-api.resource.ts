import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiService } from "../../services/api.service";
import {TopCigarModel} from '../../models/top-cigar.model'

@Injectable()
export class TopScannedCigarsApiResource extends BaseApiResource {

  constructor(private apiService: ApiService) {
    super();
  }

  public getList(days, strength) {
    return this.apiService.get('cigars/topscanned' + (days ? '?days=' + days : '?days=') + (strength ? '&strength=' + strength : ''))
      .map(res => this._mapCollection(TopCigarModel, res.json()));
  }
}
