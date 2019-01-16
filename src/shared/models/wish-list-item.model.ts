import { BaseModel } from './base.model';
import { ProductModel } from './product.model';

export const WISH_LIST = 'wishlist';

export class WishListItemModel extends BaseModel {

  public static nestedModels = {
    'Product': ProductModel,
  };

  public static mappings = {
    'CigarDetails': 'Product',
  };

  Id: number;
  Date: string;
  Name: string;
  LineId: number;
  List: string;
  ProductId: number;
  Quantity: number;
  UUID: string;
  UserId: string;
  Product: ProductModel;
  UserImageUrl: string;
  UserImageDate: string;
  Location: string;
  Price: string;

}
