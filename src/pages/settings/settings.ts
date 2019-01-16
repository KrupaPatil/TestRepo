import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

import { extractErrorMsg } from '../../app/app.common';
import { SettingsModel } from '../../shared/models/settings.model';
import { SettingsResource } from '../../shared/resources/settings.resource';
import { LayoutController } from '../../shared/services/layout.controller';
import { MyHumidorsService } from '../../shared/services/my-humidors.service';
import { PushNotificationsService } from '../../shared/services/push-notifications.service';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class Settings {
  private options: SettingsModel;
  private original: SettingsModel;
  private dropDownOptions = ['None', 'All', 'Followers'];
  private code: string;
  private codeTime: number;

  constructor(private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private toastCtrl: ToastController,
              private settingsResource: SettingsResource,
              private humidorService: MyHumidorsService,
              private pushNotificationsService: PushNotificationsService) {
    this.options = _.omit(this.activatedRoute.snapshot.data['settingsData'], ['UUID', 'UserId'])
    this.original = _.clone(this.options);
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Settings',
      'showMenuLink': false,
      'showBackLink': true,
      'showHeader': true,
      'showFooter': false
    });
  }

  updateSettings() {
    this.humidorService.updatingTempUnit(this.options.TemperatureUnit);
    this.settingsResource.updateSettings(this.options).subscribe(() => {
      if (this._detectNotificationsChange()) {
        this.pushNotificationsService.askForPermission();
      }

      let toast = this.toastCtrl.create({
        message: 'Changes have been saved',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.location.back();
    })
  }

  generateCode() {
    this.settingsResource.generateCode().subscribe((result) => {
      this.code = result.PairingCode;

      let createdOn = new Date(result.CreatedOn);
      let pairingCodeInvalidationDate = new Date(result.PairingCodeInvalidationDate);
      var timeDiff = Math.abs(pairingCodeInvalidationDate.getTime() - createdOn.getTime());
      this.codeTime = timeDiff / (1000 * 60);
    },
    (res) => {
      let alert = this.alertCtrl.create({
        title: 'Error occurred',
        subTitle: extractErrorMsg(res),
        buttons: ['OK']
      });
      alert.present();
    });
  }

  private _detectNotificationsChange() {
    return (this.options.NotifyAboutLikes && !this.original.NotifyAboutLikes)
      || (this.options.NotifyAboutNewFollowers && !this.original.NotifyAboutNewFollowers)
      || (this.options.NotifyAboutComments && !this.original.NotifyAboutComments);
  }

}
