import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { HumidorModel } from '../../models/humidor.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { MyHumidorsService } from '../my-humidors.service';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class HumidorInfoSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private myHumidorsService: MyHumidorsService,
    protected zone: NgZone
  ) {
    super(zone);
    this.resourceName = 'Humidor';
  }

  created(socketMessage: SocketMessageModel) {
  }

  deleted(socketMessage: SocketMessageModel) {
  }

  updated(socketMessage: SocketMessageModel) {
    return new Observable((o: Observer<any>) => {
      let humidor = new HumidorModel(socketMessage.Data) as any;
      humidor = _.cloneDeep(_.omit(humidor, "Cigars"));
      this.myHumidorsService.updateLoadedData(humidor);
      o.next({});
      return o.complete();
    })
  }
}
