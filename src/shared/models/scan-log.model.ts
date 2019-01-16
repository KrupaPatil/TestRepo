import { BaseModel } from './base.model';
import { ProductModel } from './product.model';

export class ScanLogModel extends BaseModel {

  public static nestedModels = {
    'data': ProductModel,
  };

  result: number;
  logId: string;
  data: any;
  blobImages: [string];
  originalImageUrl: string;

}
