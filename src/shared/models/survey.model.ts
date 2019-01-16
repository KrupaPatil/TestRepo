import { BaseModel } from './base.model';
import { SurveyAnswerModel } from './survey-answer.model';
import { SurveyResponseModel } from './survey-response.model';

export class SurveyModel extends BaseModel {

  public static nestedModels = {
    'Answer': SurveyAnswerModel,
    'Responses': SurveyResponseModel
  };

  Id:	number;
  SurveyKey: string;
  CreatedOn: string;
  Title: string;
  Description: string;
  ActivationDateUTC: string;
  DeactivationDateUTC: string;
  Answer: SurveyAnswerModel;
  Responses: SurveyResponseModel[];
}
