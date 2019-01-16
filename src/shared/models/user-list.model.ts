import { BaseModel } from './base.model';
import { ProductModel } from './product.model';

export class UserListModel extends BaseModel {

  public static nestedModels = {
    'CigarDetails': ProductModel,
  };

  CigarDetails: ProductModel;
  Date: string;
  Id: string;
  LineId: 32954;
  List: string;
  Location: null;
  LocationModified: boolean;
  ModifiedOn: string;
  Price: string;
  ProductId: number;
  Quantity: number;
  UUID: string;
  UserId: string;
  UserImageDate: string;
  UserImageUrl: string;
}
