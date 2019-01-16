import { BaseModel } from './base.model';

export class ProductNoteModel extends BaseModel {

  Id: number;
  LineId: number;
  ProductId: number;
  Note: string;
  UserId: string;
  CreatedOn: string;
  UpdatedOn: string;

}
