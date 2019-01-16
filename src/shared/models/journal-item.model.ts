import { BaseModel } from './base.model';
import { ProductModel } from './product.model';

export const JOURNAL_LIST = 'journal';

export class JournalItemModel extends BaseModel {

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
  RecognitionId: number;

  getDetailsUrl() {
    return '/my-cigars/' + this['List'] + '/' + (this['Id'] || this['_Id']);
  }
}
