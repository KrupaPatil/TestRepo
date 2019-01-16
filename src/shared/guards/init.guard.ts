import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/concat';

import { throwError } from '../../app/app.common';
import { ActiveUserService } from '../services/active-user.service';
import { MigrationService } from '../services/migration.service';
import { SocketHandlerService } from '../services/socket-handler.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class InitGuard implements CanActivateChild {

  private _initSequence = [];
  private _initSequenceCounter = 0;
  private _initSequenceRun = false;

  constructor(
    private migrationService: MigrationService,
    private activeUserService: ActiveUserService,
    private storageService: StorageService,
    private socketHandlerService: SocketHandlerService
  ) {
    // sequence of service initialisation
    this._initSequence = [
      this.storageService.init(),
      this.activeUserService.loadUser()
    ];
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // We need first to check migration, and after that to proceed with the init sequence
    return new Observable((o: Observer<boolean>) => {
      if (state.url.indexOf('migrate') !== -1) {
        o.next(true);
        o.complete();
      } else {
        this.migrationService.migrateUserAccount()
          .subscribe(
            res => {
              this.processInitSequence(o);
            },
            err => {
              throwError(`Error in migrateUserAccount: ${err}`);
              this.processInitSequence(o);
            }
          );
      }
    });
  }

  processInitSequence(o: Observer<boolean>) {
    if (this._initSequenceRun) {
      o.next(true);
      return o.complete();
    }
    this._initSequenceRun = true;

    Observable.concat(...this._initSequence)
      .subscribe(
        res => {
          return this.completeSequence(o);
        },
        err => {
          throwError(`Error in processInitSequence: ${err}`);
          return this.completeSequence(o);
        }
      );
  }

  completeSequence(o: Observer<boolean>) {
    this._initSequenceCounter++;

    if (this._initSequenceCounter >= this._initSequence.length) {
      this.socketHandlerService.init();

      o.next(true);
      return o.complete();
    }
  }
}
