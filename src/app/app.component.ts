import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Config, Platform } from 'ionic-angular';

import { BackNavigationService } from '../shared/services/back-navigation.service';
import { CanonicalUrlService } from '../shared/services/canonical-url.service';
import { GoogleAnalyticsService } from '../shared/services/google-analytics.service';
import { LayoutConfigHistory } from '../shared/services/layout-config-history';
import { NetworkService } from '../shared/services/network.service';
import { PushNotificationsService } from '../shared/services/push-notifications.service';
import { TitleService } from '../shared/services/title.service';
import { VersionService } from '../shared/services/version.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  constructor(
    private platform: Platform,
    private pushNotificationsService: PushNotificationsService,
    private layoutConfigHistory: LayoutConfigHistory,
    private location: Location,
    private titleService: TitleService,
    private networkService: NetworkService,
    private canonicalUrlService: CanonicalUrlService,
    private backNavigationService: BackNavigationService,
    private versionService: VersionService,
    public config: Config,
    private googleAnalyticsService: GoogleAnalyticsService,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode
  ) {
    if (!this.location.path()) {
      this.location.go('my-cigars');
    }
    // network service must be initialized first
    this.networkService.init();

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
      this.versionService.init();
      this.pushNotificationsService.setup();
      this.layoutConfigHistory.init();
      this.backNavigationService.init();
      this.googleAnalyticsService.init();
      this.backgroundMode.enable();
    });

    this.canonicalUrlService.init();
    this.titleService.setTitles();

    //draw keyboard settings
    this.config.set('scrollPadding', false);
    this.config.set('scrollAssist', false);
    // android
    this.config.set('android', 'scrollAssist', true);
    this.config.set('android', 'autoFocusAssist', 'delay')
  }
}
