import { BaseModel } from './base.model';
import { ProductModel } from "./product.model";

export class HumidorCigarModel extends BaseModel {
  Id: string;
  Date: string;
  ModifiedOn: string;
  Quantity: number;
  ProductId: number;
  Location: string;
  Price: number;
  Product: ProductModel;

  public static nestedModels = {
    'Product': ProductModel
  };
}
