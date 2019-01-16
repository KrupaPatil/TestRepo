import { Injectable, Injector } from '@angular/core';

import { BaseResource } from './base.resource';

import { PushNotificationApiResource } from './api/push-notification-api.resource';

@Injectable()
export class PushNotificationResource extends BaseResource {

  constructor(api: PushNotificationApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public getState() {
    return this.api.getState();
  }

  public subscribe(token, webPushKeys?) {
    return this.api.subscribe(token, webPushKeys);
  }

  public unsubscribe() {
    return this.api.unsubscribe();
  }

}
