import { BaseModel } from './base.model';

export class FeedbackModel extends BaseModel {
  Text: string;
  Email: string;
  Name: string;
  Subject: string;
  Platform: string;
  AppVersion: string;
}
