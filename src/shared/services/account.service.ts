import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { CONFIG_API_DOMAIN } from '@app/env';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ResetPasswordModel } from '../models/reset-password.model';
import { UserEditModel } from '../models/user-edit.model';
import { UserSignUpModel } from '../models/user-sign-up.model';
import { AccountResource } from '../resources/account.resource';
import { ActiveUserService } from './active-user.service';
import { ApiService } from './api.service';
import { CameraService } from './camera.service';
import { SocketHandlerService } from './socket-handler.service';

@Injectable()
export class AccountService {

  constructor(private accountResource: AccountResource,
              private apiService: ApiService,
              private cameraService: CameraService,
              private activeUserService: ActiveUserService,
              private socketHandlerService: SocketHandlerService) {
  }

  public login(email, password, isWebsiteAccount, mergeData) {
    return new Observable((o: Observer<any>) => {

      this.socketHandlerService.stop();

      return this.accountResource.login(email, password, isWebsiteAccount, mergeData)
        .subscribe(
          () => {
            this.activeUserService.fetchUser()
              .subscribe(
                (res) => {

                  this.socketHandlerService.init();

                  o.next(res);
                  return o.complete();
                },
                (err) => {
                  return o.error(err);
                }
              );
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public loginViaProvider(provider, providerId, email, firstName, lastName, avatarUrl, mergeData) {
    return new Observable((o: Observer<any>) => {
      return this.accountResource.loginViaProvider(provider, providerId, email, firstName, lastName, avatarUrl, mergeData)
        .subscribe(
          () => {
            this.activeUserService.fetchUser()
              .subscribe(
                (res) => {
                  o.next(res);
                  return o.complete();
                },
                (err) => {
                  return o.error(err);
                }
              );
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public signUp(user: UserSignUpModel) {
    return new Observable((o: Observer<any>) => {
      return this.accountResource.signUp(user)
        .subscribe(
          () => {
            this.activeUserService.fetchUser()
              .subscribe(
                (res) => {
                  o.next(res);
                  return o.complete();
                },
                (err) => {
                  return o.error(err);
                }
              );
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public logout() {
    return new Observable((o: Observer<any>) => {

      this.socketHandlerService.stop();

      return this.accountResource.logout()
        .subscribe(
          () => {
            this.activeUserService.fetchUser()
              .subscribe(
                (res) => {

                  this.socketHandlerService.init();

                  o.next(res);
                  return o.complete();
                },
                (err) => {
                  return o.error(err);
                }
              );
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public forgotPassword(email: string) {
    return this.accountResource.forgotPassword(email);
  }

  public resetPassword(userData: ResetPasswordModel) {
    return this.accountResource.resetPassword(userData);
  }

  public update(user: UserEditModel) {
    return new Observable((o: Observer<any>) => {
      return this.accountResource.update(user)
        .subscribe(
          () => {
            o.next(this.activeUserService.update({
              Email: user.Email,
              FirstName: user.FirstName,
              LastName: user.LastName,
              Nickname: user.Nickname
            }));
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public changeProfilePicture(url: string) {
    return new Observable((o: Observer<any>) => {
      return this.accountResource.changeAvatar(url)
        .subscribe(
          () => {
            o.next(this.activeUserService.update({
              AvatarUrl: url
            }));
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  uploadProfilePicture(croppedImage) {
    let result = this.cameraService.imageToFormData(croppedImage);
    return this.apiService
      .post(CONFIG_API_DOMAIN + '/images/useravatar', result.formData, result.options)
      .map((response: Response) => response.json() as string);
  }
}
