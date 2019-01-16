import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CONFIG_ENVIRONMENT } from '@app/env';
import { AppVersion } from '@ionic-native/app-version';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Platform } from 'ionic-angular';

const TRACKING_CODE = 'UA-60808453-1';
const TRACKING_CODE_WEB = 'UA-60808453-2';

declare var window: any;
declare var ga: any;

@Injectable()
export class GoogleAnalyticsService {

  private ga;

  constructor(private router: Router,
              private platform: Platform,
              private appVersion: AppVersion,
              private gaCordova: GoogleAnalytics) {
    if (!this.platform.is('cordova') && ga) {
      this.ga = ga;
    }
  }

  public init() {
    if (CONFIG_ENVIRONMENT === 'dev') {
      return;
    }

    if (this.ga) {
      this._initWeb();
    } else if(this.gaCordova) {
      this._initCordova();
    }
  }

  private _initWeb() {
    // this is done according to https://www.27partners.com/2016/07/using-google-analytics-in-an-ionic-app-without-a-plugin/
    // can be used also in mobile apps
    this.ga('create', {
      // Disables cookies.
      storage: 'none',
      // Your GA tracking id.
      trackingId: TRACKING_CODE_WEB,
      // Will return null if not set, and GA will then assign one.
      clientId: window.localStorage.getItem('ga:clientId')
    });

    // Disable checkProtocolTask.
    this.ga('set', 'checkProtocolTask', null);​
    // Set the transport url manually.
    this.ga('set', 'transportUrl', 'https://www.google-analytics.com/collect');

    this.ga(function(tracker) {
      if (!window.localStorage.getItem('ga:clientId') ) {
        // Save the assigned id for the next time the app boots.
        window.localStorage.setItem( 'ga:clientId', tracker.get('clientId') );
      }
    });

    this._trackPageChanges();
  }

  private _initCordova() {
    this.gaCordova.startTrackerWithId(TRACKING_CODE)
      .then(() => {
        this.appVersion.getVersionNumber()
          .then((currentVersion) => {
            this.gaCordova.setAppVersion(currentVersion);
          });

        this._trackPageChanges();
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  private _trackPageChanges() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        if (this.ga) {
          this.ga('set', 'page', event.url);
          this.ga('send', 'pageview');
        } else if (this.gaCordova) {
          this.gaCordova.trackView(event.url);
        }
      });
  }

  public trackEvent(category, action) {
    if (CONFIG_ENVIRONMENT === 'dev') {
      return;
    }

    if (this.ga) {
      this.ga('send', 'event', {
        eventCategory: category,
        eventAction: action
      });
    } else if (this.gaCordova) {
      this.gaCordova.trackEvent(category, action);
    }
  }

}
