import { Component } from '@angular/core';
import { LayoutController } from '../../shared/services/layout.controller';
import { AlertController, LoadingController } from 'ionic-angular';
import { FeedbackModel } from '../../shared/models/feedback.model';
import { FeedbackResource } from '../../shared/resources/feedback.resource';
import { ActiveUserService } from '../../shared/services/active-user.service';
import { ActivatedRoute } from '@angular/router';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  private appVersion;
  private isSubmitted = false;
  private isFromSurvey: boolean = false;
  private feedbackData: FeedbackModel = new FeedbackModel({});
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private activeUserService: ActiveUserService,
              private device: Device,
              private feedbackResource: FeedbackResource,
              private activatedRoute: ActivatedRoute,
              private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data: any) => {
      this.isFromSurvey = data.title == 'Feedback-survey';
    });

    this.layoutCtrl.configure({
      'pageTitle': 'Feedback',
      'showBackLink': true
    });

    this.appVersion = window.localStorage.getItem('app_version');
    if (this.toolsMenuWrapper && window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }

    if (this.activeUserService.isAuthenticated()) {
      let user = this.activeUserService.user();
      this.feedbackData.Name = `${user.FirstName} ${user.LastName}`;
      this.feedbackData.Email = user.Email;
    }
  }

  submit(valid) {
    if (valid) {
      let loading = this.loadingCtrl.create({
        content: 'Loading...'
      });
      loading.present();

      if (this.device.platform) {
        this.feedbackData.Platform = this.device.platform;
        this.feedbackData.AppVersion = this.appVersion;
      } else {
        this.feedbackData.Platform = 'Web';
        this.feedbackData.AppVersion = 'PWA';
      }

      this.feedbackResource.sendFeedback(this.feedbackData)
        .subscribe(
          () => {
            loading.dismiss();
            this.isSubmitted = true;
          },
          (res) => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              buttons: ['OK']
            });
            alert.present();
          }
        );
    }

    else {
      let alert = this.alertCtrl.create({
        title: 'Error occurred',
        subTitle: 'You have errors to correct',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
  }

  ngOnDestroy() {
    if (this.toolsMenuWrapper && window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = null;
    }
  }
}
