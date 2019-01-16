import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { SocialPostData } from '../../shared/data/social-post.data';

import { UserModel } from '../models/user.model';
import { AccountResource } from '../resources/account.resource';

@Injectable()
export class ActiveUserService {

  private activeUser: UserModel;
  private loadingInProgress: boolean = false;

  constructor(
    private accountResource: AccountResource,
    private socialPostData: SocialPostData
  ) {
  }

  public loadUser() {
    return new Observable((o: Observer<any>) => {
      if (this.loadingInProgress) {
        this.waitForUserToLoad(o);
      } else {
        this.loadingInProgress = true;

        return this.accountResource.getUser()
          .subscribe(
            (res: UserModel) => {
              this.loadingInProgress = false;

              this.activeUser = res;

              o.next(this.activeUser);
              return o.complete();
            },
            (err) => {
              return o.error(err);
            }
          );
      }
    });
  }

  public fetchUser() {
    return new Observable((o: Observer<any>) => {
      return this.accountResource.fetchUser()
        .subscribe(
          (res: UserModel) => {
            this.activeUser = res;

            o.next(this.activeUser);
            return o.complete();
          },
          (err) => {
            return o.error(err);
          }
        );
    });
  }

  public isAuthenticated() {
    return this.activeUser && this.activeUser.Id;
  }

  public user() {
    return this.activeUser;
  }

  public update(data) {
    this.socialPostData.updateActiveUser(this.activeUser.Id, data);
    _.assignIn(this.activeUser, data);
    this.accountResource.localUpdate(this.activeUser).subscribe();

    return this.activeUser;
  }

  public getID() {
    return this.isAuthenticated() ? this.activeUser.Id : null;
  }

  private waitForUserToLoad(o: Observer<any>) {
    if (!this.loadingInProgress) {
      o.next(this.activeUser);
      o.complete();
    } else {
      setTimeout(() => {
        this.waitForUserToLoad(o);
      }, 100);
    }
  }

}
