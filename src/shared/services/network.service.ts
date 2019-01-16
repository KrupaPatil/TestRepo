import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';

declare var navigator: any;

@Injectable()
export class NetworkService {

  public onConnect = new Subject();

  constructor() { }

  init() {
    window.addEventListener('online', () => {
      this.onConnect.next({connected: true});
    });
  }

  notConnectedError(observer?) {
    let err = {json: () => ({Message: 'No internet connection.'})};

    if (observer) {
      return observer.error(err);
    } else {
      return new Observable((o: Observer<any>) => {
        return o.error(err);
      });
    }
  }

  public isConnected() {
    return navigator.onLine;
  }

}
