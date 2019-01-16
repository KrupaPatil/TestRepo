import { Injectable, Inject } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class DeviceService {

  constructor() {
  }

  public getDeviceID() {
    return window['device'] ? window['device'].uuid : this._getWebDeviceId();
  }

  private _getWebDeviceId() {
    const key = 'cs3_web_device_id';

    if (!window.localStorage[key]) {
      window.localStorage[key] = 'web_' + UUID.UUID();
    }

    return window.localStorage[key];
  }

}
