import { BaseModel } from './base.model';

export class ProductTagModel extends BaseModel {

  Id: number;
  LineId: number;
  ProductId: number;
  Tag: string;
  Weight: number;

}
