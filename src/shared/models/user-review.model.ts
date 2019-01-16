import { BaseModel } from './base.model';
import { UserModel } from './user.model';
import { CommentModel } from './comment-model';

export class UserReviewModel extends BaseModel {

  public static nestedModels = {
    'Author': UserModel
  };

  AppearanceRating: number;
  AromaRating: number;
  BurnRating: number;
  TasteRating: number;
  Rating: number;
  CigarBandImgUrl: string;
  CigarName: string;
  CigarOverallRating: {};
  CigarPrices: {};
  Comment: string;
  CreatedOn: string;
  DrawRating: number;
  Id: number;
  LineId: number;
  ProductId: number;
  UpdatedOn: string;
  User: UserModel;
}
