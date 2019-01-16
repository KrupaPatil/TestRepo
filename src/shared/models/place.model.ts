import { BaseModel } from './base.model';

export class PlaceModel extends BaseModel {
  reasons: any;
  referralId: string;
  venue: any;

  call() {
    window.open('tel:' + this.venue.contact.phone, '_system');
  }
}
