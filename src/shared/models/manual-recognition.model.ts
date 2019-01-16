import { BaseModel } from './base.model';

export class ManualRecognitionModel extends BaseModel {
  ImageUrl: string;
  LogId: string;
  Platform?: string;
  Email?: string;
  SendEmail?: boolean;
}
