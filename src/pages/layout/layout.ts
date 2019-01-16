import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { CONFIG_IS_MOBILE } from '@app/env';
import { AlertController, LoadingController, MenuController, PopoverController } from 'ionic-angular';
import * as _ from 'lodash';

import { extractErrorMsg, throwError } from '../../app/app.common';
import { SocialPostData } from '../../shared/data/social-post.data';
import { NotificationResource } from '../../shared/resources/notification.resource';
import { AccountService } from '../../shared/services/account.service';
import { ActiveUserService } from '../../shared/services/active-user.service';
import { CacheStorageService } from '../../shared/services/cache-storage.service';
import { CameraService } from '../../shared/services/camera.service';
import { EmitterService } from '../../shared/services/emitter.service';
import { LayoutConfig } from '../../shared/services/layout-config';
import { LayoutController } from '../../shared/services/layout.controller';
import { RouterService } from '../../shared/services/router.service';
import { LoginPage } from '../auth/login/login';
import { MyCigarsPage } from '../my-cigars/my-cigars';
import { MyHumidorsPage } from '../my-humidors/my-humidors';
import { SocialPage } from '../social/social';
import { SocialGroupPopover } from '../social/social-group-popover/social-group-popover';
import { ToolsPage } from '../tools/tools';
import { StorageService } from './../../shared/services/storage.service';


declare var window: any;

@Component({
  selector: 'layout',
  templateUrl: 'layout.html'
})
export class Layout {

  myCigarsTab: any = MyCigarsPage;
  socialTab: any = SocialPage;
  myHumidorsTab: any = MyHumidorsPage;
  toolsTab: any = ToolsPage;
  loginPage: any = LoginPage;
  mobile: boolean = true;
  notificationNumber: number;

  constructor(private activeUserService: ActiveUserService,
              private layoutCtrl: LayoutController,
              private accountService: AccountService,
              private alertCtrl: AlertController,
              private cameraService: CameraService,
              private layoutConfig: LayoutConfig,
              private popoverCtrl: PopoverController,
              private loadingCtrl: LoadingController,
              private notificationResource: NotificationResource,
              private menuCtrl: MenuController,
              private storageService: StorageService,
              private socialPostData: SocialPostData,
              private emitterService: EmitterService,
              private router: RouterService,
              private location: Location,
              private cacheStorageService: CacheStorageService) {
  }

  ngOnInit() {
    this.mobile = CONFIG_IS_MOBILE;
    this.emitterService.notificationCounterData.subscribe((notificationStatus) => {
      this.notificationNumber = notificationStatus;
    });

    this.notificationResource.get()
      .subscribe(
        (notifications) => {
          const unreadNotifications = _.filter(notifications, {IsRead: false});
          this.emitterService.changeNotificationCounter(unreadNotifications.length);
        }
      );

    this.emitterService.currentUrlData.subscribe((path) => {
      this.onRouteChange(path);
    });
  }

  logout() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.accountService.logout()
      .subscribe(
        () => {
          this.storageService.clear().subscribe(() => {
            this.clearCacheStorage();
            this.menuCtrl.close();
            loading.dismiss();
            this.router.navigate(['/login']);
          });
        },
        (res) => {
          loading.dismiss();

          const message = extractErrorMsg(res);

          if (message !== "You're logged out") {
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: message,
              buttons: ['OK']
            });
            alert.present();
          }
        }
      );
  }

  takePicture() {
    this.cameraService.takePicture()
      .subscribe(
        () => {
          this.router.navigate(['/scan-cigar']);
        },
        (error) => {
          if (error) {
            throwError(`Error taking picture ${JSON.stringify(error)}`);
          }
        }
      );
  }

  closeDetailsPage() {
    let detailsElement = <HTMLElement>document.querySelector('.cigar-details-container');
    if (detailsElement) {
      this.emitterService.closeDetailsScreen();
    }
  }

  private clearCacheStorage() {
    if ('serviceWorker' in navigator) {
      this.cacheStorageService.clear();
    }
  }

  getSocialPostsGroup() {
    return this.socialPostData.selectedTypedAllPosts ? 'All Users' : 'Users I follow';
  }

  selectPostsGroup() {
    let popover = this.popoverCtrl.create(SocialGroupPopover, {
      showOptions: (status) => {
        let loading = this.loadingCtrl.create({
          content: 'Loading...'
        });
        loading.present();
        this.socialPostData.checkPostTypeStatus(status).subscribe(
          () => {
            loading.dismiss();
          },

          (err) => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: extractErrorMsg(err),
              buttons: ['OK']
            });
            alert.present();
          }
        );
      }
    }, {cssClass: 'social-group-popover'});
    popover.present();
  }

  manualBackButton() {
    return this.location.back();
  }

  clearAllNotifications() {
    this.emitterService.clearAllNotifications();
  }

  backToJournal() {
    this.router.navigate(['/my-cigars']);
  }

  onRouteChange(path) {
    if (path == '/my-cigars') {
      this.layoutCtrl.configure({
        'pageTitle': 'My Cigars',
        'showSearchProduct': true,
        'showMenuLink': true,
        'manualBackButton': false
      });
    } else if (path == '/social') {
      this.layoutCtrl.configure({
        'pageTitle': 'Social',
        'showMenuLink': true,
        'showSocialPostsGroup': true,
        'showUserSearch': true,
        'manualBackButton': false,
        'showCreateSocialPostButton': true
      });
    } else if (path.indexOf('/social/user-profile') > -1) {
      this.layoutCtrl.configure({
        'manualBackButton': true,
        'showBackLink': false,
        'showCreateSocialPostButton': false
      });
    } else if (path == '/tools') {
      this.layoutCtrl.configure({
        'pageTitle': 'Tools',
        'showMenuLink': true
      });
    } else if (path.indexOf('/my-humidors') > -1) {
      if (path == '/my-humidors') {
        this.layoutCtrl.configure({
          'pageTitle': 'My Humidors',
          'showMenuLink': true,
          'manualBackButton': false,
          'showBackLink': false
        });
      } else {
        this.layoutCtrl.configure({
          'manualBackButton': false,
          'showBackLink': true
        });
      }
    }
    else {
      this.layoutCtrl.configure({
        'showSocialPostsGroup': false,
        'showUserSearch': false,
        'showCreateSocialPostButton': false
      });
    }
  }
}
