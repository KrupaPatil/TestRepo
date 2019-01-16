import { BaseModel } from './base.model';

export class SurveyAnswerModel extends BaseModel {

  Id: number;
  SurveyResponseId:	number;
  UserId: string;
  UUID: string;
  AnswerDateUTC: string;
  Text: string;
  AppVersion: string;
  UserActivityLevel: number;
}
