import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { MigrationV2Service } from './migration-v2.service';
import { RouterService } from './router.service';
import { AlertController, LoadingController } from 'ionic-angular';
import { AccountService } from './account.service';
import { MigrationResource } from '../resources/migration.resource';
import * as _ from 'lodash';
import { extractErrorMsg } from "../../app/app.common";

@Injectable()
export class MigrationService {

  constructor(private migrationV2Service: MigrationV2Service,
              private injector: Injector,
              private loadingCtrl: LoadingController,
              private migrationResource: MigrationResource,
              private alertCtrl: AlertController) {
  }

  migrateUserAccount() {
    return new Observable((o: Observer<any>) => {
      let oldUserData = this.migrationV2Service.getOldUserData();

      if (_.isEmpty(oldUserData) || this.isUserAccountMigrated()) {
        o.next(false);
        o.complete();
      } else if (oldUserData.facebookId) {
        if (oldUserData.id && oldUserData.id.indexOf('@') !== -1 && oldUserData.firstName && oldUserData.lastName) {
          this.migrateFacebookUser(
            oldUserData.facebookId,
            oldUserData.id,
            oldUserData.firstName,
            oldUserData.lastName
          ).subscribe(
              () => {
                o.next(true);
                o.complete();
              },
              () => {
                o.next(false);
                o.complete();
              }
            );
        } else {
          this.injector.get(RouterService).navigate(['/migrate']);
          o.next(true);
          o.complete();
        }
      } else if (oldUserData.id) {
        this.injector.get(RouterService).navigate(['/migrate']);
        o.next(true);
        o.complete();
      } else {
        this.migrateUserData()
          .subscribe(
            () => {
              o.next(true);
              o.complete();
            },
            () => {
              o.next(false);
              o.complete();
            }
          );
      }
    });
  }

  migrateFacebookUser(facebookId, email, firstName, lastName) {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    return new Observable((o: Observer<any>) => {
      this.injector.get(AccountService).loginViaProvider(
        'facebook',
        facebookId,
        email,
        firstName,
        lastName,
        null,
        false
      ).subscribe(
        () => {
          loading.dismiss();

          this.migrateUserData()
            .subscribe(
              res => {
                o.next(res);
                return o.complete();
              },
              err => {
                return o.error(err);
              }
            )
        },
        (err) => {
          loading.dismiss();
          return o.error(err);
        }
      );
    })
  }

  migrateUserData() {
    return new Observable((o: Observer<any>) => {

      let userData = this.migrationV2Service.getOldUserData();

      if (_.isEmpty(userData) || this.isUserAccountMigrated()) {
        o.next(null);
        return o.complete();
      }

      let loading = this.loadingCtrl.create({
        content: 'Migrating your data, this may take a while...'
      });
      loading.present();

      this.setUserAccountMigrated();

      this.migrationResource.migrate({
        'LegacyUserId': userData.id,
        'LegacyUUID': userData.uuid,
        'Data': JSON.stringify(userData)
      }).subscribe(
          () => {
            loading.dismiss();
            o.next(true);
          },
          err => {
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: extractErrorMsg(err),
              buttons: ['OK']
            });
            alert.present();
          }
        );
    });
  }

  private setUserAccountMigrated() {
    window.localStorage.setItem('cs3_user_account_migrated', 'yes');
  }

  private isUserAccountMigrated() {
    return window.localStorage.getItem('cs3_user_account_migrated') === 'yes';
  }
}
