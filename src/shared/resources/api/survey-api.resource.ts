import { Injectable } from '@angular/core';
import { BaseApiResource } from './base-api.resource';
import { ApiService } from '../../services/api.service';
import { SurveyModel } from "../../models/survey.model";

@Injectable()
export class SurveyApiResource extends BaseApiResource {

  constructor(private apiService: ApiService) {
    super();
  }

  public getSurveys() {
    return this.apiService.get('surveys')
      .map(res => this._mapCollection(SurveyModel, res.json()));
  }

  public answerSurvey(id, responseId, appVersion) {
    return this.apiService.post(`surveys/${id}/answer/${responseId}`, {'AppVersion': appVersion})
      .map(res => res.json());
  }

  public deleteSurvey(id) {
    return this.apiService.delete(`surveys/${id}/answer`)
  }
}
