import * as _ from 'lodash';
import { renameKeys } from '../../app/app.common';

export class BaseModel {

  public static nestedModels: { [key: string]: any } = {};
  public static mappings: { [key: string]: string } = {};

  constructor(data: Object) {
    if (_.isEmpty(data)) return;

    let mappings = this['constructor']['mappings'];

    if (mappings) {
      data = renameKeys(data, mappings);
    }

    let nestedModels = this['constructor']['nestedModels'];

    _.each(data, (value, key) => {
      if (_.has(nestedModels, key) && !_.isNull(value)) {
        this[key] = _.isArray(data[key]) ?
          _.map(data[key], (submodelValue) => {
            return new nestedModels[key](submodelValue);
          }) : new nestedModels[key](data[key]);
      } else {
        this[key] = value;
      }
    });
  }

}
