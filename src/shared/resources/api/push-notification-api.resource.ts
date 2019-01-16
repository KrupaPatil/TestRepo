import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from "../../services/api.service";
import { Device } from '@ionic-native/device';

@Injectable()
export class PushNotificationApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService,
              private device: Device) {
    super();
  }

  public getState() {
    return this.apiService.get('notifications/state')
      .map(res => res.json());
  }

  public subscribe(token, webPushKeys?) {
    let data;

    if (token) {
      data = {
        NotificationToken: token,
        Platform: this.device.platform == 'Android' ? 'Firebase' : this.device.platform,
        DeviceManufacturer: this.device.manufacturer,
        DeviceModel: this.device.model
      };
    } else {
      data = {
        Platform: 'Web',
        WebPush: webPushKeys
      };
    }

    data['Misc'] = "CSv3 mobile app v.1.0";

    return this.apiService.post('notifications/subscribe', data);
  }

  public unsubscribe() {
    return this.apiService.post('notifications/unsubscribe', {})
      .map(res => res.json());
  }

}
