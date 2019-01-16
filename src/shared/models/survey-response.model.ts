import { BaseModel } from './base.model';

export class SurveyResponseModel extends BaseModel {

  Id:	number;
  SurveyId:	number;
  OrderNo: number;
  Label: string;
  FollowupText: string;
  DontAskAgain: boolean;
}
