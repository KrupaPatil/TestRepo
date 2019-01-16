import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular';

import { versionCompare } from '../../app/app.common';
import { PushNotificationsService } from './push-notifications.service';

declare var window: any;

const VERSION_KEY = 'app_version';

@Injectable()
export class VersionService {

  constructor(
    private platform: Platform,
    private pushNotificationsService: PushNotificationsService,
    private appVersion: AppVersion,
    private http: Http
  ) { }

  public init() {
    if (this.platform.is('cordova')) {
      let previousVersion = window.localStorage.getItem(VERSION_KEY);

      this.appVersion.getVersionNumber()
        .then((currentVersion) => {
          if (versionCompare(currentVersion, previousVersion) !== 0) {
            window.localStorage.setItem(VERSION_KEY, currentVersion);

            if (currentVersion && previousVersion) {
              // we detected upgrade here
              this.pushNotificationsService.askForPermission();
            }
          }
        });
    } else {
      this.http.get('/assets/version.txt').subscribe((value: Response) => {
        window.localStorage.setItem(VERSION_KEY, value.text());
      });
    }
  }

}
