import { BaseModel } from './base.model';
import { ProductModel } from "./product.model";
import { HumidorCigarModel } from "./humidor-cigar.model";
import * as _ from 'lodash';

export class HumidorModel extends BaseModel {

  constructor(data: Object) {
    let cigars = _.clone(data['Cigars']);
    super(data);
    this._setCigars(cigars);
  }

  public static nestedModels = {
    'Cigars': HumidorCigarModel
  };

  CigarAddedOn: string;
  CigarDeletedOn: string;
  CigarUpdatedOn: string;
  Cigars: HumidorCigarModel[];
  CigarsTotalPrice: number;
  CigarsTotalQuantity: number;
  CreatedOn: string;
  Humidity: number;
  HumidorId: string;
  Id:  string;
  ModifiedOn: string;
  Name: string;
  NotifyOnHumidityUnder: number;
  NotifyOnHumidityOver: number;
  NotifyOnTemperatureUnder: number;
  NotifyOnTemperatureOver: number;
  NotifyOnBatteryUnder: number;
  SensorBatteryLevel: number;
  SensorDeviceId: string;
  SensorMeasurementDate: string;
  SensorPairingCode: string;
  SensorOfflineSince: string;
  ValuesRepeatedDate: string;
  Temperature: number;
  TemperatureUnit: string;
  NotifyOnSuddenConditionChange: boolean;

  getTotalNumberOfCigars() {
    return _.sumBy(this.Cigars, 'Quantity');
  }

  increaseCigarQuantity(productId, quantity?) {
    let pq = _.find(this.Cigars, {'ProductId': productId}) as HumidorCigarModel;

    if (pq) {
      pq.Quantity = _.isNumber(quantity) ? quantity : pq.Quantity + 1;
    }
  }

  decreaseCigarQuantity(productId, quantity?) {
    let pq = _.find(this.Cigars, {'ProductId': productId}) as HumidorCigarModel;

    if (pq) {
      pq.Quantity = _.isNumber(quantity) ? quantity : pq.Quantity - 1;
    }
  }

  hasCigar(product) {
    return _.find(this.Cigars, {'ProductId': product.Id});
  }

  addCigar(product: ProductModel) {
    if (!this.hasCigar(product)) {
      this.Cigars.unshift(
        new HumidorCigarModel({
          'Quantity': 1,
          'ProductId': product.Id,
          'Product': product,
          'Date': new Date().toISOString()
        })
      );
    }
  }

  deleteCigar(productId) {
    _.remove(this.Cigars, {'ProductId': productId});
  }

  totalPrice() {
    let total = 0;
    _.each(this.Cigars, (cigar) => {
      if (cigar.Price) {
        total += cigar.Price * cigar.Quantity;
      } else {
        total += cigar.Product.Prices.SinglePriceMin * cigar.Quantity;
      }
    });

    return total.toFixed(2);
  }

  private _setCigars(cigars) {
    this['Cigars'] = [];

    if (cigars) {
      _.each(cigars, cigar => {
        let product = cigar['CigarDetails'] ?
          new ProductModel(cigar['CigarDetails'])
          : new ProductModel(cigar['Product']);

        if (!_.find(this['Cigars'], {ProductId: product.Id})) {
          let humidorCigar = new HumidorCigarModel({
            Id: cigar['Id'],
            Date: cigar['Date'] ? cigar['Date'] : new Date().toISOString(),
            ModifiedOn: cigar['ModifiedOn'] ? cigar['ModifiedOn'] : new Date().toISOString(),
            Quantity: cigar['Quantity'],
            ProductId: product.Id,
            Product: product,
            Location: cigar['Location'],
            Price: cigar['Price']
          });

          this['Cigars'].push(humidorCigar);
        }
      });

      this.sortCigars();
    }
  }

  public sortCigars(sortBy = 'CreatedOn', ascending = false) {
    this.Cigars.sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) {
        return ascending ? -1 : 1;
      } else if (a[sortBy] > b[sortBy]) {
        return ascending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getDetailsUrl() {
    return '/my-humidors/' + (this['Id'] || this['_Id']);
  }

}
