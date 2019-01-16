import { Injectable } from '@angular/core';
import { NotificationApiResource } from './api/notification-api.resource';

@Injectable()
export class NotificationResource {
  constructor(private api: NotificationApiResource) {
  }

  public get() {
    return this.api.getList();
  }

  public notificationStatus(id, undoRead) {
    return this.api.notificationStatus(id, undoRead);
  }

  public deleteNotification(id, undoRead) {
    return this.api.deleteNotification(id, undoRead);
  }

  public deleteAll() {
    return this.api.deleteAll();
  }

  public setAllNotificationsAsRead() {
    return this.api.setAllNotificationsAsRead();
  }
}
