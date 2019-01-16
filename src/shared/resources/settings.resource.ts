import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { SettingsApiResource } from './api/settings-api.resource';
import { SettingsDbResource } from './db/settings-db.resource';
import { SettingsModel } from '../models/settings.model';

@Injectable()
export class SettingsResource extends BaseResource {

  constructor(db: SettingsDbResource,
              api: SettingsApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  getSettings() {
    return this.api.getSettings()
  };

  updateSettings(settings: SettingsModel) {
    return this.api.updateSettings(settings);
  }

  generateCode() {
    return this.api.generateCode();
  }
}
