import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { SocketMessageModel } from '../../models/socket-message.model';
import { ActiveUserService } from '../active-user.service';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class UserSocketEventHandler implements SocketEventHandlerInterface {

  constructor(private activeUserService: ActiveUserService) {
  }

  created(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      o.next({});
      return o.complete();
    });
  }

  deleted(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      o.next({});
      return o.complete();
    });
  }

  updated(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      this.activeUserService.update({
        Email: socketMessage.Data.Email,
        FirstName: socketMessage.Data.FirstName,
        LastName: socketMessage.Data.LastName,
        AvatarUrl: socketMessage.Data.AvatarUrl
      });

      o.next({});
      return o.complete();
    });
  }

}
