import { BaseModel } from './base.model';
import { UserModel } from './user.model';

export class CommentModel extends BaseModel {

  public static nestedModels = {
    'Author': UserModel
  };

  Id: number;
  Date: string;
  User: UserModel;
  Text: string;

}
