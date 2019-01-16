import { Injectable, Injector } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';

import { CONFIG_ENVIRONMENT } from '@app/env';
import { ApiService } from './api.service';
import { DeviceService } from './device.service';
import { ActiveUserService } from './active-user.service';
import { Device } from '@ionic-native/device';
import { StorageService } from "./storage.service";

@Injectable()
export class AppErrorHandler implements IonicErrorHandler {

  private activeUserService: ActiveUserService;
  private deviceService: DeviceService;
  private apiService: ApiService;
  private device: Device;
  private storageService: StorageService;

  private lastError;

  constructor(
    private injector: Injector
  ) {
  }

  private _init() {
    this.activeUserService = this.injector.get(ActiveUserService);
    this.deviceService = this.injector.get(DeviceService);
    this.apiService = this.injector.get(ApiService);
    this.device = this.injector.get(Device);
    this.storageService = this.injector.get(StorageService);
  }

  private _preventThrottling(err) {
    return !this.lastError ||
      (this.lastError.err !== err && Date.now() - this.lastError.date > 30000); // avoid sending duplicate errors in short time
  }

  handleError(err: any): void {
    this._init();

    if (CONFIG_ENVIRONMENT === 'dev') {
      throw err;
    } else if (this._preventThrottling(err)) {

      // handling error when app can't write to local database
      if (err.message && err.message.indexOf('QuotaExceededError') > -1) {
        alert("We noticed a problem with processing data. It is recommended that you restart your browser or the application.");
      }

      let message = {
        "Message": `
          Error: ${err.message}
          Url: ${document.location.href}
          Last Request: ${JSON.stringify(this.apiService.getLastRequest())}
        `,
        "StackTrace": err.stack,
        "Platform": CONFIG_ENVIRONMENT,
        "UUID": this.deviceService.getDeviceID(),
        "UserId": this.activeUserService.getID(),
        "DeviceManufacturer": this.device.manufacturer,
        "DeviceModel": this.device.model,
        "Name": "CS3 Frontend Console Error",
        "Version": "3.0.1.3"
      };

      this.lastError = {
        err: err,
        date: Date.now()
      };

      console.log('ERROR LOGGED', message);

      this.apiService.post('errors', message)
        .subscribe();
    }
  }
}
