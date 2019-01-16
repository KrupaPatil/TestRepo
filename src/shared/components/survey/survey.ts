import { Component, EventEmitter, Input, Output } from '@angular/core'
import { SurveyService } from '../../services/survey.service';
import { SurveyModel } from '../../models/survey.model';
import { AlertController, Platform } from 'ionic-angular';
import { RouterService } from '../../services/router.service';
import { LayoutController } from "../../services/layout.controller";
import { Device } from '@ionic-native/device';

@Component({
  selector: 'survey',
  templateUrl: `survey.html`
})
export class Survey {
  @Input() survey: SurveyModel;
  @Input() showSurvey: boolean;
  @Output() showSurveyChange = new EventEmitter();
  appVersion: string;
  helperLabel: string = "Don\'t ask again";

  constructor(private surveyService: SurveyService,
              private alertCtrl: AlertController,
              private platform: Platform,
              private device: Device,
              private layoutCtrl: LayoutController,
              private router: RouterService) {
  }

  ngOnInit() {
    if (this.device.platform) {
      this.appVersion = window.localStorage.getItem('app_version');
    } else {
      this.appVersion = 'PWA';
    }
  }

  goToFeedback(response) {
    this.layoutCtrl.configure({
      'showHeader': true,
      'showFooter': true
    });
    this.surveyService.answerSurvey(response.SurveyId, response.Id, this.appVersion);
    this.showSurvey = false;
    this.showSurveyChange.emit(this.showSurvey);
    this.router.navigateByUrl('feedback-survey');
  }

  goToAppRating(response) {
    let alert = this.alertCtrl.create({
      subTitle: 'Please consider rating us, it helps us grow and improve. Thank you for spending some time with us!',
      buttons: [
        {
          text: 'Rate Cigar Scanner',
          role: 'Rate Cigar Scanner',
          handler: () => {
            this.layoutCtrl.configure({
              'showHeader': true,
              'showFooter': true
            });
            this.surveyService.answerSurvey(response.SurveyId, response.Id, this.appVersion);
            this.showSurvey = false;
            this.showSurveyChange.emit(this.showSurvey);
            if (this.platform.is('ios') || this.platform.is('android')) {
              this.platform.ready().then(() => {
                if (this.platform.is('ios')) {
                  open('https://itunes.apple.com/us/app/cigar-scanner/id1022032215?mt=8', "_system", "location=true");
                } else if (this.platform.is('android')) {
                  open('https://play.google.com/store/apps/details?id=com.ionicframework.cigarscanner238202&hl=en', "_system", "location=true");
                }
              });
            } else {
              window.open("https://play.google.com/store/apps/details?id=com.ionicframework.cigarscanner238202&hl=en", "_blank");
            }
          }
        },
        {
          text: 'Remind me later',
          role: 'Remind me later',
          handler: () => {
            this.layoutCtrl.configure({
              'showHeader': true,
              'showFooter': true
            });
            this.surveyService.deleteSurvey(response.SurveyId);
            this.showSurvey = false;
            this.showSurveyChange.emit(this.showSurvey);
          }
        },
        {
          text: 'No Thanks',
          role: 'No Thanks',
          handler: () => {
            this.layoutCtrl.configure({
              'showHeader': true,
              'showFooter': true
            });
            this.surveyService.answerSurvey(response.SurveyId, response.Id, this.appVersion);
            this.showSurvey = false;
            this.showSurveyChange.emit(this.showSurvey);
          }
        }
      ],
      cssClass: 'alertCustomCss'
    });
    alert.present();
  }

  dontAskAgain(response) {
    this.layoutCtrl.configure({
      'showHeader': true,
      'showFooter': true
    });
    this.showSurvey = false;
    this.showSurveyChange.emit(this.showSurvey);
    this.surveyService.answerSurvey(response.SurveyId, response.Id, this.appVersion);
  }
}
