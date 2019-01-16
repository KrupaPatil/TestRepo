import { Injector } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { NetworkService } from '../services/network.service';
import { ApiResourceInterface } from './api/api-resource.interface';
import { DbResourceInterface } from './db/db-resource.interface';

export class BaseResource {

  protected db;
  protected api;
  protected injector;
  protected networkService;
  protected loadingCtrl;

  constructor(db: DbResourceInterface,
              api: ApiResourceInterface,
              injector: Injector) {
    this.db = db;
    this.api = api;
    this.injector = injector;
  }

  private _getNetworkService() {
    if (!this.networkService) {
      this.networkService = this.injector.get(NetworkService);
    }

    return this.networkService;
  }

  private _getLoadingController() {
    if (!this.loadingCtrl) {
      this.loadingCtrl = this.injector.get(LoadingController);
    }

    return this.loadingCtrl;
  }

  protected _get(apiCall: Observable<any>, dbCall: Observable<any>, dbUpdateFn: (data: any) => any = null, showLoaderForAPICall: boolean = true) {
    return new Observable((o: Observer<any>) => {
      dbCall
        .subscribe(
          (result) => {
            o.next(result);
            return o.complete();
          },
          (err) => {
            if (err && err.status === 404) {
              return this._fetchAndComplete(apiCall, dbUpdateFn, o, showLoaderForAPICall);
            } else {
              return o.error(err);
            }
          }
        );
    });
  }

  protected _fetchAndComplete(apiCall: Observable<any>, dbUpdateFn: (data: any) => any, o: Observer<any>, showLoaderForAPICall: boolean = true) {
    let loading;

    if (showLoaderForAPICall) {
      loading = this._getLoadingController().create({
        content: 'Loading...'
      });
      loading.present();
    }

    apiCall.subscribe(
      (results) => {
        if (dbUpdateFn) {
          dbUpdateFn(results).subscribe();
        } else {
          this.db.update(results).subscribe();
        }

        if (loading) {
          loading.dismiss();
        }
        o.next(results);
        return o.complete();
      },
      (err) => {
        if (loading) {
          loading.dismiss();
        }
        return o.error(err);
      }
    );
  }

  protected _upsertWithDeferredApiCall(apiCall: Observable<any>,
                                       dbUpdateFn: (data: any) => any,
                                       data: any) {
    let networkService = this._getNetworkService();

    return new Observable((o: Observer<any>) => {
      if (!networkService.isConnected()) {
        return networkService.notConnectedError(o);
      }

      dbUpdateFn(data)
        .subscribe(
          (item) => {
            apiCall.subscribe(
              (apiRes) => {
                _.assignIn(item, apiRes);

                if (dbUpdateFn) {
                  dbUpdateFn(item).subscribe();
                } else {
                  this.db.update(item).subscribe();
                }
              }
            );

            o.next(item);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  protected _deleteWithDeferredApiCall(apiCall: Observable<any>,
                                       dbUpdateFn: (data: any) => any,
                                       data: any) {
    let networkService = this._getNetworkService();

    return new Observable((o: Observer<any>) => {
      if (!networkService.isConnected()) {
        return networkService.notConnectedError(o);
      }

      dbUpdateFn(data)
        .subscribe(
          (item) => {
            apiCall.subscribe();
            o.next(item);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

}
