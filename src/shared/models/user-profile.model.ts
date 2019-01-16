import { BaseModel } from './base.model';

export class UserProfileModel extends BaseModel {
  UserId: string;
  UUID: string;
  RegisteredOn: string;
  Nickname: string;
  FirstName: string;
  LastName: string;
  AvatarUrl: string;
  Cigars: number;
  CigarsInJournal: number;
  CigarsInFavorites: number;
  CigarsInWishlist: number;
  Humidors: number;
  HumidorsValue: number;
  Reviews: number;
  Notes: number;
  Scans: number;
  SocialPosts: number;
  SocialComments: number;
  SocialLikes: number;
  Followers: number;
  Following: number;
  FollowedOn: number
}
