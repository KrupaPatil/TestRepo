import { Injectable } from '@angular/core';
import { SurveyModel } from '../models/survey.model';
import { SurveyResource } from '../resources/survey.resource';
import { LayoutController } from './layout.controller';
import { AlertController} from 'ionic-angular';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import {extractErrorMsg} from '../../app/app.common';

@Injectable()
export class SurveyService {

  public surveys: SurveyModel[];

  constructor(private surveyResource: SurveyResource,
              private alertCtrl: AlertController,
              private layoutCtrl: LayoutController) {
  }

  public getSurveys() {
    return new Observable((o: Observer<any>) => {
      return this.surveyResource.getSurveys().subscribe(
        (result: SurveyModel[]) => {
          this.surveys = result;
          if (this.surveys.length) {
            this.layoutCtrl.configure({
              'showHeader': false,
              'showFooter': false
            });
            o.next(this.surveys);
            return o.complete();
          } else {
            return o.complete();
          }

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
    });
  }

  public answerSurvey(id, responseId, appVersion) {
    this.surveyResource.answerSurvey(id, responseId, appVersion).subscribe(
      (res) => {},
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

  public deleteSurvey(id) {
    this.surveyResource.deleteSurvey(id).subscribe(
      (res) => {
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
