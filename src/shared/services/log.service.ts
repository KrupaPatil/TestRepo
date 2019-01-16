import { Injectable } from '@angular/core';

import { CONFIG_ENVIRONMENT } from '@app/env';
import { DeviceService } from './device.service';
import { ApiService } from './api.service';

@Injectable()
export class LogService {

  constructor(
    private deviceService: DeviceService,
    private apiService: ApiService
  ) {
  }

  public log(message: string) {
    let msg = {
      "Message": message,
      "StackTrace": '',
      "Platform": CONFIG_ENVIRONMENT,
      "UUID": this.deviceService.getDeviceID(),
      "UserId": null, // TODO
      "Name": "CS3 Frontend Log"
    };

    this.apiService.post('errors', msg)
      .subscribe();
  }
}
