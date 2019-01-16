import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserSignUpModel } from '../models/user-sign-up.model';
import { MigrationV2Service } from '../services/migration-v2.service';
import * as _ from 'lodash';

@Injectable()
export class OldUserDataResolver implements Resolve<any> {
  constructor(
    private migrationV2Service: MigrationV2Service) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let oldUserData = this.migrationV2Service.getOldUserData();

    if (!_.isEmpty(oldUserData)) {
      return this.extractSignUpData(oldUserData);
    } else {
      return new UserSignUpModel({
        Email: '',
        FirstName: '',
        LastName: '',
      });
    }
  }

  private extractSignUpData(oldUserData) {
    let email = '';

    if (oldUserData.id && oldUserData.id.indexOf('@') !== -1) {
      email = oldUserData.id;
    }

    return new UserSignUpModel({
      Email: email,
      FirstName: oldUserData.firstName,
      LastName: oldUserData.lastName,
    });
  }
}
