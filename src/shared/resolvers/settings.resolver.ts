import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SettingsResource } from '../../shared/resources/settings.resource';

@Injectable()
export class SettingsResolver implements Resolve<any> {
  constructor(private settingsResource: SettingsResource) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.settingsResource.getSettings();
  }
}
