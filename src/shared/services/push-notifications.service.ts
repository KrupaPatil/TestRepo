import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG_FCM_SENDER_ID } from '@app/env';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AlertController, Platform } from 'ionic-angular';

import { mobileAndTabletCheck, throwError } from '../../app/app.common';
import { PushNotificationResource } from '../resources/push-notification.resource';
import { EmitterService } from './emitter.service';

declare var window: any;

@Injectable()
export class PushNotificationsService {

  constructor(private platform: Platform,
              private pushNotificationResource: PushNotificationResource,
              private alertCtrl: AlertController,
              private router: Router,
              private push: Push,
              private emitterService: EmitterService) {
  }

  public setup() {
    if (!this.platform.is('cordova')) {
      this._initWeb();
    } else {
      this._initCordova();
    }
  }

  public askForPermission() {
    if (this.platform.is('cordova')) {
      this._askForPermissionCordova();
    } else {
      this._askForPermissionWeb();
    }
  }

  private _askForPermissionCordova() {
    this.push.hasPermission()
      .then((data) => {
        if (!data || !data.isEnabled) {
          let confirm = this.alertCtrl.create({
            title: 'Your notifications are OFF',
            message: 'Turn on notifications to be notified even you are not in the app',
            buttons: [
              {
                text: 'Cancel',
                handler: () => {}
              },
              {
                text: 'Turn On',
                handler: () => {
                  let openSettings = this.platform.is('ios') ? 'notification_id' :
                    (this.platform.is('android') ? 'application' : null);

                  if (openSettings) {
                    window.cordova.plugins.settings.open(
                      openSettings,
                      () => {},
                      (err) => {
                        throwError(`Error openning settings ${JSON.stringify(err)}`);
                      }
                    );
                  }
                }
              }
            ]
          });
          confirm.present();
        }
      })
      .catch((err) => {
        throwError(`Error calling Push.hasPermission ${JSON.stringify(err)}`);
      });
  }

  private _askForPermissionWeb() {
    if ('serviceWorker' in navigator && mobileAndTabletCheck()) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.pushManager.permissionState({userVisibleOnly: true})
            .then((state) => {
              if (state == 'denied') {
                let alert = this.alertCtrl.create({
                  title: 'Your notifications are OFF',
                  message: 'You can enable notifications in your browser settings',
                  buttons: [
                    {
                      text: 'Ok',
                      handler: () => {}
                    }
                  ]
                });
                alert.present();
              }
            })
            .catch((err) => {
              throwError(`Error calling permissionState ${JSON.stringify(err)}`);
            });
        });
    }
  }

  private _initWeb() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.pushManager.subscribe({userVisibleOnly: true})
            .then((subscription) => {
              this.pushNotificationResource.subscribe(null, this._getSubscriptionData(subscription)).subscribe();
            })
            .catch((err) => {
              // user rejected notifications
            });

            navigator.serviceWorker.onmessage = (event) => {
              var data = event.data;

              console.log(data.data);

              if (data.command == 'pushNotificationRecieved') {
                this.emitterService.increaseNotificationCounter();
              }
            };
        });
    }
  }

  private _initCordova() {
    // Create a channel requred for Android O and above
    this.push.createChannel({
      id: 'cigarScanner',
      description: 'Cigar Scanner Notification Channel',
      // 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 3
    }).then(() => console.log('Channel cigarScanner created'));

    const options: PushOptions = {
      android: {
        senderID: CONFIG_FCM_SENDER_ID,
        icon: 'ic_notification',
        iconColor: '#dd423e',
        forceShow: true
      },
      ios: {
        badge: true,
        sound: true,
        alert: true,
        clearBadge: true
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => {
      this.pushNotificationResource.subscribe(registration.registrationId).subscribe();
    });

    pushObject.on('notification').subscribe((notification: any) => {
      let data = this.platform.is('ios') ? notification.additionalData.data : notification.additionalData;

      if (data.RedirectUrl) {
        window.open(data.RedirectUrl, '_system');
        return;
      }

      if (data.Social.Action == 'Follow') {
        let userId = data.Social.UserId;
        this.router.navigateByUrl(`/social/user-profile/users/${userId}`);
        return;
      }

      if (data.Social.SocialPostId) {
        let post = data.Social.SocialPostId;
        this.router.navigateByUrl(`/social/post/${post}`);
        return;
      }

      if (data.ProductId) {
        let product = `P-${data.ProductId}`;
        this.router.navigateByUrl(`/cigar/${product}`);
        return;
      }

      if (data.LineId) {
        let product = `L-${data.LineId}`;
        this.router.navigateByUrl(`/cigar/${product}`);
        return;
      }

      this.router.navigateByUrl('/notifications');
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  private _getSubscriptionData(subscription) {
    const rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';

    const rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    const authSecret = rawAuthSecret ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
      '';

    return {
      endpoint: subscription.endpoint,
      p256dh: key,
      auth: authSecret
    };
  }

}
