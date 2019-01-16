import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { AccountService } from '../account.service';

declare var FB: any;
declare var window: any;


@Injectable()
export class FacebookAuthService {
  private mergeData:any;

  constructor(private accountService: AccountService,
              private fb: Facebook) {
  }

  public login(mergeData) {
    this.mergeData = mergeData;
    return new Observable((o: Observer<any>) => {
      if (window.cordova) {
        return this._cordovaLogin(o);
      } else {
        return this._webLogin(o);
      }
    });
  }

  private _cordovaLogin(o: Observer<any>) {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((response: FacebookLoginResponse) => {
        if (response.status === 'connected') {
          this.fb.api('/me?fields=id,email,picture,first_name,last_name', [])
            .then((response) => {
              this.accountService.loginViaProvider(
                'facebook',
                response.id,
                response.email,
                response.first_name,
                response.last_name,
                response.picture.data.url,
                this.mergeData
              ).subscribe(
                (res) => {
                  o.next(res);
                  return o.complete();
                },
                (err) => {
                  return o.error(err);
                }
              );
            })
            .catch(err => {
              return o.error(err);
            });
        } else {
          // user canceled
          return o.error('User cancelled.');
        }
      })
      .catch(err => {
        return o.error(err);
      });
  }

  private _webLogin(o: Observer<any>) {
    FB.login((response) => {
      if (response.status === 'connected') {
        FB.api('/me', {fields: 'id,email,picture.type(large),first_name,last_name'}, (response) => {
          this.accountService.loginViaProvider(
            'facebook',
            response.id,
            response.email,
            response.first_name,
            response.last_name,
            response.picture.data.url,
            this.mergeData
          ).subscribe(
            (res) => {
              o.next(res);
              return o.complete();
            },
            (err) => {
              return o.error(err);
            }
          );
        });
      } else {
        // user canceled
        return o.error('User cancelled.');
      }
    }, {scope: 'public_profile,email,user_friends'});
  }

}
