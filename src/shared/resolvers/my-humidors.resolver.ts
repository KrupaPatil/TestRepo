import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { SettingsResource } from '../resources/settings.resource';
import { MyHumidorsService } from '../services/my-humidors.service';

@Injectable()
export class MyHumidorsResolver implements Resolve<any> {
  constructor(private myHumidorService: MyHumidorsService,
              private settingsResource: SettingsResource) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin([this.myHumidorService.loadHumidors()
      .catch(() => {
        return Observable.of(null);
      }), this.settingsResource.getSettings()]);
  }
}
