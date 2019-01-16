import { BaseModel } from './base.model';

export class UserDataSummaryModel extends BaseModel {
  Cigars: number;
  CigarsInJournal: number;
  CigarsInFavorites: number;
  CigarsInWishlist: number;
  Humidors: number;
  Reviews: number;
  Notes: number;
  Scans: number;
  SocialPosts: number;
  SocialComments: number;
  SocialLikes: number;
}
