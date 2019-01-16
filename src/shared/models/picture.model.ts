import { BaseModel } from './base.model';

export class PictureModel extends BaseModel {
  file: Blob;
  data: string;
  width: number;
  height: number;
  location: any;
}
