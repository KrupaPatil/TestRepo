import { BaseModel } from './base.model';

export class ProductMyCigarFeaturesModel extends BaseModel {

  Id: number;
  UserId: string;
  UUID: string;
  ProductId: number;
  LineId: number;
  CreatedOn: string;
  UpdatedOn: string;
  SmokingTime: number;

}
