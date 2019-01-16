import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';

import { ResetPasswordModel } from '../../../shared/models/reset-password.model';
import { UserEditModel } from '../../models/user-edit.model';
import { UserSignUpModel } from '../../models/user-sign-up.model';
import { UserModel } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { ApiResourceInterface } from './api-resource.interface';
import { BaseApiResource } from './base-api.resource';

@Injectable()
export class AccountApiResource extends BaseApiResource implements ApiResourceInterface {

  constructor(private apiService: ApiService) {
    super();
  }

  public getUser() {
    return new Observable((o: Observer<any>) => {
      return this.apiService.get('account')
        .map(res => new UserModel(res.json()))
        .subscribe(
          (res) => {
            o.next(res);
            return o.complete();
          },
          () => {
            // return empty model
            o.next(new UserModel({}));
            return o.complete();
          }
        );
    });
  }

  public login(email, password, isWebsiteAccount, mergeData) {
    return this.apiService.post(
      'account/login?isWebsiteAccount=' + (isWebsiteAccount ? 'true' : 'false') + '&mergeData=' + mergeData,
      {
        "Email": email,
        "Password": password
      }
    )
      .map(res => res);
  }

  public loginViaProvider(provider, providerId, email, firstName, lastName, avatarUrl, mergeData) {
    return this.apiService.post(
      'account/login/' + provider + '?mergeData=' + mergeData,
      {
        "Id": providerId,
        "Email": email,
        "FirstName": firstName,
        "LastName": lastName,
        "AvatarUrl": avatarUrl
      }
    )
      .map(res => res);
  }

  public logout() {
    return this.apiService.post('account/logout', {})
      .map(res => res);
  }

  public signUp(user: UserSignUpModel) {
    return this.apiService.post('account/register', user)
      .map(res => res);
  }

  public forgotPassword(email: string) {
    return this.apiService.post('account/forgotpassword', {'Email': email});
  }

  public resetPassword(userData: ResetPasswordModel) {
    return this.apiService.post('account/resetpassword', userData);
  }

  public update(user: UserEditModel) {
    return this.apiService.post('account/update', user)
      .map(res => res);
  }

  public changeAvatar(imageUrl: string) {
    return this.apiService.post('account/avatar', this._prepareStringAsPayload(imageUrl))
      .map(res => res);
  }

}
