import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

declare var window: any;

@Injectable()
export class TwitterAuthService {

  constructor(
  ) {
  }

  public login() {
    return new Observable((o: Observer<any>) => {
      if (window.cordova) {
        return this._cordovaLogin();
      } else {
        return this._webLogin();
      }
    });
  }

  private _cordovaLogin() {
    console.log('not done yet')
  }

  private _webLogin() {
    console.log('not done yet')
  }

}
