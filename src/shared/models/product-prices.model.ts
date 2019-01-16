import { BaseModel } from './base.model';

const DISPLAY_PARTNER_PRICES = 'Y';

export class ProductPricesModel extends BaseModel {

  public static mappings = {
    'SinglePrice': 'SinglePriceMin',
    'PartnerSinglePriceMin': 'SinglePriceMin',
    'PartnerSinglePriceMax': 'SinglePriceMax',
    'PartnerBoxPriceMin': 'BoxPriceMin',
    'PartnerBoxPriceMax': 'BoxPriceMax',
  };

  SinglePriceMin: number;
  SinglePriceMax: number;
  BoxPriceMin: number;
  BoxPriceMax: number;
  DisplayPartnerPrices: string;

  showPartnerPrices(): boolean {
    return this.DisplayPartnerPrices === DISPLAY_PARTNER_PRICES;
  }

}
