import { BaseModel } from './base.model';

export class ProductAttributesModel extends BaseModel {

  Manufacturer: string;
  ManufacturerDescription: number;
  Origin: string;
  Strength: string;
  Wrapper: string;
  WrapperColor: string;
  WrapperColorDescription: number;
  Binder: string;
  BinderDescription: string;
  Filler:string;
  FillerDescription: number;
  IsSpecific: boolean;
  Length:string;
  MasterLine: string;
  RingGauge: number;
  Section: string;
  Shape: string;
  ShapeDescription: number;
  SinglePackaging: string;

}
