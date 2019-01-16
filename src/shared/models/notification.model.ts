import { BaseModel } from './base.model';
import { ProductModel } from './product.model';

export class NotificationModel extends BaseModel {

  public static nestedModels = {
    'SearchResult': ProductModel,
  };

  Id: number;
  UserId: string;
  UUID: string;
  Message: string;
  DeliveryState: string;
  CreatedOn: string;
  DismissedOn: string;
  IsRead: boolean;
}
