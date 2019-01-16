import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { HumidorModel } from '../../models/humidor.model';
import { SocketMessageModel } from '../../models/socket-message.model';
import { HumidorDbResource } from '../../resources/db/humidor-db.resource';
import { MyHumidorsService } from '../my-humidors.service';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class HumidorSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private humidorDbResource: HumidorDbResource,
    private myHumidorsService: MyHumidorsService,
    protected zone: NgZone
  ) {
    super(zone);
    this.resourceName = 'Humidor';
  }

  created(socketMessage: SocketMessageModel) {
    let humidor = new HumidorModel(socketMessage.Data);

    // Ignore the message if Id is not defined
    if (!humidor.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.humidorDbResource.updateCollectionItem({ Id: humidor.Id }, true),
      this.myHumidorsService.updateLoadedData.bind(this.myHumidorsService),
      humidor
    );
  }

  deleted(socketMessage: SocketMessageModel) {
    return this._update(
      this.humidorDbResource.deleteCollectionItem({ Id: socketMessage.Data }),
      this.myHumidorsService.deleteLoadedData.bind(this.myHumidorsService),
      { Id: socketMessage.Data }
    );
  }

  updated(socketMessage: SocketMessageModel) {
    let humidor = new HumidorModel(socketMessage.Data);

    // Ignore the message if Id is not defined
    if (!humidor.Id) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.humidorDbResource.updateCollectionItem({ Id: humidor.Id }, true),
      this.myHumidorsService.updateLoadedData.bind(this.myHumidorsService),
      humidor
    );
  }

}
