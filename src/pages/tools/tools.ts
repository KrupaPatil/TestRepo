import { Component } from '@angular/core';
import { LayoutController } from '../../shared/services/layout.controller';
import { AlertController, Platform } from 'ionic-angular';
import { SurveyService } from '../../shared/services/survey.service';
import { SurveyModel } from '../../shared/models/survey.model';
import { extractErrorMsg } from '../../app/app.common';


@Component({
  selector: 'tools',
  templateUrl: 'tools.html'
})
export class ToolsPage {
  showSurvey = false;
  survey: SurveyModel[] = [];
  appVersion: string;

  constructor(private alertCtrl: AlertController,
              private layoutCtrl: LayoutController,
              private surveyService: SurveyService,
              private platform: Platform) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Tools',
      'showMenuLink': true,
      'showBackLink': false,
      'manualBackButton': false,
      'showHeader': true,
      'showFooter': true
    });

    this.appVersion = window.localStorage.getItem('app_version');

    if (window.innerWidth < 1200) {
      this.surveyService.getSurveys().subscribe(
        (survey: SurveyModel[]) => {
          this.survey = survey;
          this.showSurvey = true;
        },
        (res) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
    }
  }

  hideOnIosUntilDate() {
    if (this.platform.is('ios')) {
      let setDate = Date.parse("January 1, 2018");
      let todayDate: any = new Date();
      todayDate = Date.parse(todayDate);
      return (todayDate < setDate);
    }
  }

}
