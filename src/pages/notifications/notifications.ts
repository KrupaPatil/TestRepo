import { Component } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LayoutController } from '../../shared/services/layout.controller';
import { NotificationResource } from '../../shared/resources/notification.resource'
import { NotificationModel } from '../../shared/models/notification.model';
import { Router } from '@angular/router';
import { EmitterService } from '../../shared/services/emitter.service';
import { extractErrorMsg } from '../../app/app.common';
import * as _ from 'lodash';


@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})

export class NotificationsPage {

  private notifications: NotificationModel[];
  private readNotifications: NotificationModel[];
  private unreadNotifications: NotificationModel[];
  private deletedNotification: NotificationModel;
  notificationCounter: number;
  deletedNotificationIndex: number;

  constructor(private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private emitterService: EmitterService,
              private toastCtrl: ToastController,
              private notificationResource: NotificationResource,
              private router: Router) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Notifications',
      'showMenuLink': false,
      'manualBackButton': true,
      'showBackLink': false,
      'showSearchProduct': false,
      'clearAllNotifications': true
    });
    this.getNotifications();

    this.emitterService.clearAllNotificationsData.subscribe(() => {
      this.deleteAll();
    });
  }

  getNotifications() {
    let loading = this.loadingCtrl.create({
      content: 'Fetching notifications...'
    });
    loading.present();

    this.notificationResource.get()
      .subscribe(
        (notifications: [NotificationModel]) => {
          this.notifications = notifications;
          this.unreadNotifications = _.filter(notifications, {IsRead: false});
          this.readNotifications = _.filter(notifications, {IsRead: true});
          this.notificationCounter = this.unreadNotifications.length;
          this.emitterService.changeNotificationCounter(this.notificationCounter);
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
      )
  }

  deleteNotification(notification, index) {
    this.deletedNotification = notification;
    this.deletedNotificationIndex = index;
    this.notifications.splice(index, 1);
    this.notificationCounter = this.notificationCounter - 1;
    this.emitterService.changeNotificationCounter(this.notificationCounter);
    this.notificationResource.deleteNotification(notification.Id, false)
      .subscribe(
        (res) => {
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

    let toast = this.toastCtrl.create({
      message: 'You have deleted notification',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Undo'
    });

    toast.onDidDismiss((data, role) => {
      if (role == "close") {
        this.undoDelete();
      }
    });

    toast.present();
  }

  undoDelete() {
    this.notifications.splice(this.deletedNotificationIndex, 0, this.deletedNotification);
    this.notificationCounter = this.notificationCounter + 1;
    this.emitterService.changeNotificationCounter(this.notificationCounter);
    this.notificationResource.deleteNotification(this.deletedNotification.Id, true)
      .subscribe(
        (res) => {
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      )
  }

  deleteAll() {
    this.notificationResource.deleteAll()
      .subscribe(
        () => {
          this.notifications.length = 0;
          this.notificationCounter = 0;
          this.emitterService.changeNotificationCounter(this.notificationCounter);
        },
        err => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      )
  }

  navigateTo(notification, i) {
    if (!notification.IsRead) {
      this.markAsRead(notification, i)
    }

    if (notification.RedirectUrl) {
      window.open(notification.RedirectUrl, '_system');
      return;
    }

    if (notification.SocialPostId) {
      this.router.navigate(['social/post/' + notification.SocialPostId]);
      return;
    }

    let product;
    if (notification.ProductId) {
      product = "P-" + notification.ProductId;
    } else if (notification.LineId) {
      product = "L-" + notification.LineId;
    }

    if (product) {
      this.router.navigateByUrl('/cigar/' + product);
    } else {
      let id = notification.UserId || notification.UUID;
      let userType = notification.UserId ? 'users' : 'guests';
      this.router.navigate([`/social/user-profile/${userType}/${id}`]);
    }
  }

  markAsRead(notification, index) {
    this.unreadNotifications.splice(index, 1);
    this.notificationCounter = this.notificationCounter - 1;
    this.emitterService.changeNotificationCounter(this.notificationCounter);
    this.notificationResource.notificationStatus(notification.Id, false)
      .subscribe(
        (res) => {
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
  }

  ngOnDestroy() {
    this.layoutCtrl.configure({
      'clearAllNotifications': false
    });
  }
}
