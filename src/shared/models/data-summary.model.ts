import { BaseModel } from './base.model';

export class DataSummaryModel extends BaseModel {
  Users: number;
  Reviews: number;
  Products: number;
  CustomProducts: number;
  Lines: number;
  Scans: number;
  SocialPosts: number;
  SocialComments: number;
  SocialLikes: number
}
