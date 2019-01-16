import { Injectable, Injector } from '@angular/core';
import { BaseResource } from './base.resource';
import { SurveyDbResource } from "./db/survey-db.resource";
import { SurveyApiResource } from "./api/survey-api.resource";

@Injectable()
export class SurveyResource extends BaseResource {

  constructor(db: SurveyDbResource,
              api: SurveyApiResource,
              injector: Injector) {
    super(db, api, injector);
  }

  public getSurveys() {
    return this.api.getSurveys();
  }

  public answerSurvey(id, responseId, appVersion) {
    return this.api.answerSurvey(id, responseId, appVersion);
  }

  public deleteSurvey(id) {
    return this.api.deleteSurvey(id);
  }

}
