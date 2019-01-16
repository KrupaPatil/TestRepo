import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ResetPasswordModel } from '../models/reset-password.model';
import { UserEditModel } from '../models/user-edit.model';
import { UserSignUpModel } from '../models/user-sign-up.model';
import { AccountApiResource } from './api/account-api.resource';
import { BaseResource } from './base.resource';
import { AccountDbResource } from './db/account-db.resource';

@Injectable()
export class AccountResource extends BaseResource {

  constructor(db: AccountDbResource,
              api: AccountApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getUser() {
    return this._get(
      this.api.getUser(),
      this.db.get(),
      null,
      false
    );
  }

  public fetchUser() {
    return new Observable((o: Observer<any>) => {
      return this._fetchAndComplete(this.api.getUser(), null, o);
    });
  }

  public login(email, password, isWebsiteAccount, mergeData) {
    return this.api.login(email, password, isWebsiteAccount, mergeData);
  }

  public loginViaProvider(provider, providerId, email, firstName, lastName, avatarUrl, mergeData) {
    return this.api.loginViaProvider(provider, providerId, email, firstName, lastName, avatarUrl, mergeData);
  }

  public logout() {
    return this.api.logout();
  }

  public signUp(user: UserSignUpModel) {
    return this.api.signUp(user);
  }

  public forgotPassword(email: string) {
    return this.api.forgotPassword(email);
  }

  public resetPassword(userData: ResetPasswordModel) {
    return this.api.resetPassword(userData);
  }

  public update(user: UserEditModel) {
    return this.api.update(user);
  }

  public changeAvatar(imageUrl) {
    return this.api.changeAvatar(imageUrl);
  }

  public localUpdate(user) {
    return this.db.update(user);
  }

}
