import { BaseModel } from './base.model';
import { ProductModel } from './product.model';

export class TopCigarModel extends BaseModel {

  public static nestedModels = {
    'CigarDetails': ProductModel,
  };

  BrandName: string;
  CigarDetails: ProductModel;
  LineId: number;
  Rating: {};
}
