import { Injectable, Injector } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CONFIG_API_DOMAIN } from '@app/env';
import { DeviceService } from './device.service';
import { NetworkService } from './network.service';
import { StorageService } from './storage.service';

@Injectable()
export class ApiService {

  private lastRequest = {};

  constructor(private http: Http,
              private networkService: NetworkService,
              private deviceService: DeviceService,
              private storageService: StorageService,
              private injector: Injector) {
  }

  private prepareUrl(url) {
    const pattern = /^https?:\/\/|^\/\//i;

    if (!pattern.test(url)) {
      url = CONFIG_API_DOMAIN + '/' + url;
    }

    return url;
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this.lastRequest = {
      url: url,
      options: options
    };

    return this.intercept(this.http.get(this.prepareUrl(url), this.getRequestOptionArgs(options)));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this.lastRequest = {
      url: url,
      body: body,
      options: options
    };

    return this.intercept(this.http.post(this.prepareUrl(url), body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this.lastRequest = {
      url: url,
      body: body,
      options: options
    };

    return this.intercept(this.http.put(this.prepareUrl(url), body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this.lastRequest = {
      url: url,
      options: options
    };

    return this.intercept(this.http.delete(this.prepareUrl(url), this.getRequestOptionArgs(options)));
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }

    if (!options.headers.has('Content-Type')) {
      options.headers.append('Content-Type', 'application/json');
    } else if (options.headers.get('Content-Type') === undefined) {
      options.headers.delete('Content-Type');
    }

    options.headers.append('X-Device-UUID', this.deviceService.getDeviceID());
    options.withCredentials = true;

    return options;
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    if (!this.networkService.isConnected()) {
      return Observable.throw(
        {json: () => ({Message: 'No internet connection.'})}
      );
    }

    return observable.catch((err, source) => {
      this.lastRequest['error'] = {
        status: err.status,
        text: err.statusText
      };

      if (err.status === 401) {
        // not authenticated
        err.message = "You're logged out";

        if (this.injector.get('ActiveUserService').isAuthenticated()) {
          this.storageService.clear().subscribe();
        }
      }
      return Observable.throw(err);
    });
  }

  public getLastRequest() {
    return this.lastRequest;
  }
}
