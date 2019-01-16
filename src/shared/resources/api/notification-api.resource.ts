import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiResourceInterface } from './api-resource.interface';
import { ApiService } from '../../services/api.service';

@Injectable()
export class NotificationApiResource extends BaseApiResource implements ApiResourceInterface {
  constructor(private apiService: ApiService) {
    super();
  }

  public getList() {
    return this.apiService.get('notifications?UnreadOnly=false&Take=50&Skip=0')
      .map(res => res.json());
  }

  public notificationStatus(id, undoRead) {
    return this.apiService.post('notifications/' + id + '/dismiss?undo=' + undoRead,{});
  }

  public deleteNotification(id, undoDelete) {
    return this.apiService.delete('notifications/' + id + '?undo=' + undoDelete,{});
  }

  public deleteAll() {
    return this.apiService.post('notifications/deleteall',{});
  }

  public setAllNotificationsAsRead() {
    return this.apiService.post('notifications/dismissall',{})
  }
}
