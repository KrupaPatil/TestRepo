import { Injectable } from '@angular/core';

import { SettingsModel } from '../../models/settings.model';
import { ApiService } from '../../services/api.service';
import { ApiResourceInterface } from './api-resource.interface';
import { BaseApiResource } from './base-api.resource';

@Injectable()
export class SettingsApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  getSettings() {
        return this.apiService.get('social/settings')
          .map(
            res => this._mapItem(SettingsModel, res.json())
          );
  }

  updateSettings(settings: SettingsModel) {
    return this.apiService.post('social/settings', settings);
  }

  generateCode() {
    return this.apiService.post('account/token/generatecode', {})
      .map((res) => res.json());
  }
}
