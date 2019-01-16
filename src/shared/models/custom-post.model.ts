import { BaseModel } from './base.model';

export class CustomPostModel extends BaseModel {
  cigarLocation: string;
  cigarTitle: string;
  cigarText: string;
  userImageUrl: string;
}
