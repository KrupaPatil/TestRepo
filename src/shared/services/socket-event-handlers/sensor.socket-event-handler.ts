import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { SocketMessageModel } from '../../models/socket-message.model';
import { HumidorDbResource } from '../../resources/db/humidor-db.resource';
import { MyHumidorsService } from '../my-humidors.service';
import { BaseSocketEventHandler } from './base.socket-event-handler';
import { SocketEventHandlerInterface } from './socket-event-handler.interface';

@Injectable()
export class SensorSocketEventHandler extends BaseSocketEventHandler implements SocketEventHandlerInterface {

  constructor(
    private humidorDbResource: HumidorDbResource,
    private myHumidorsService: MyHumidorsService,
    protected zone: NgZone
  ) {
    super(zone);
    this.resourceName = 'Humidor';
  }

  created(socketMessage: SocketMessageModel) {
    let sensorData = _.pick(socketMessage.Data, 'SensorDeviceId', 'Date', 'Humidity', 'Temperature', 'TemperatureUnit', 'BluetoothSignal') as any;
    sensorData.SensorOfflineSince = null;
    sensorData.SensorBatteryLevel = socketMessage.Data.BatteryLevel;
    sensorData.SensorMeasurementDate = socketMessage.Data.Date;

    // Ignore the message if HumidorId is not defined
    if (!socketMessage.Data.HumidorId) {
      return new Observable((o: Observer<any>) => {
        o.next({});
        return o.complete();
      });
    }

    return this._update(
      this.humidorDbResource.updateCollectionItem({ Id: socketMessage.Data.HumidorId }, true),
      this.myHumidorsService.updateLoadedData.bind(this.myHumidorsService),
      sensorData
    );
  }

  deleted(socketMessage: SocketMessageModel) {
  }

  updated(socketMessage: SocketMessageModel) {
  }
}
