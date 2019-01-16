import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { MyHumidorsService } from '../services/my-humidors.service';
import * as moment from 'moment';

@Injectable()
export class HumidorMeasurementsResolver implements Resolve<any> {

  constructor(
    private myHumidorService: MyHumidorsService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let daysBack = 1;
    let dateFrom = moment().startOf('day').subtract(daysBack, 'days').format('YYYY-MM-DD HH:mm:ss');
    let dateTo = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.myHumidorService.getMeasurements(route.params['HumidorId'], dateFrom, dateTo);
  }
}
