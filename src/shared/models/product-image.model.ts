import { BaseModel } from './base.model';

export class ProductImageModel extends BaseModel {

  Id: number;
  LineId: number;
  ProductId: number;
  ImageUrl: string;
  Width: number;
  Height: number;

}
