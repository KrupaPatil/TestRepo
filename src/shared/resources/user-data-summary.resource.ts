import { Injectable, Injector } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { extractErrorMsg } from '../../app/app.common';
import { UserDataSummaryApiResource } from './api/user-data-summary-api.resource';
import { BaseResource } from './base.resource';

@Injectable()
export class UserDataSummaryResource extends BaseResource {

  constructor(private alertCtrl: AlertController,
              api: UserDataSummaryApiResource,
              injector: Injector) {
    super(null, api, injector);
  }

  public listingsSummary: any;
  public listingSummaryUpdated: Subject<any> = new Subject<any>();

  public updateSummary() {
    this.listingSummaryUpdated.next(this.listingsSummary);
  }

  public getUserDataSummary() {
    return new Observable(o => {
        return this.api.getUserDataSummary()
          .subscribe(
            (res: any) => {
              o.next(res);
              o.complete();
            },
            (res) => {
              let alert = this.alertCtrl.create({
                title: 'Error occurred',
                subTitle: extractErrorMsg(res),
                buttons: ['OK']
              });
              alert.present();
            });
      }
    );
  };
}
