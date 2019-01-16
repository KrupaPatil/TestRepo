import { BaseModel } from './base.model';
import * as _ from 'lodash';

export class SocketMessageModel extends BaseModel {

  constructor(data: Object) {
    super(data);
    this.parseData();
  }

  Action: string;
  Channel: string;
  CreatedOnUTC: string;
  Data: any;
  Entity: string;
  Id: number;
  Source: any;
  UUID: string;
  UserId: string;

  private parseData() {
    if (_.isString(this.Data)) {
      this.Data = JSON.parse(this.Data);
    }
  }

}
