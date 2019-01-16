import { BaseModel } from './base.model';
import { UserModel } from './user.model';
import { CommentModel } from './comment-model';

export class SocialPostModel extends BaseModel {

  public static nestedModels = {
    'Author': UserModel
  };

  Action: string;
  CigarBandImgUrl: string;
  CigarName: string;
  CigarPrices: {};
  CigarRating: {};
  Comments: number;
  CreatedOn: string;
  Id: number;
  ImageUrl: string;
  Liked: boolean;
  Likes: number;
  LineId: number;
  Location: string;
  ProductId: number;
  ReviewInfo: {};
  Text: string;
  Title: string;
  TopComments: [CommentModel];
  UpdatedOn: string;
  User: UserModel;
  FollowerIds: string[];
}
