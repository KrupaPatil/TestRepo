import * as _ from 'lodash';

export class BaseApiResource {

  _mapItem (modelClass, item) {
    return new modelClass(item);
  }

  _mapCollection (modelClass, items) {
    let ret = [];

    _.each(items, (item) => {
      ret.push(new modelClass(item));
    });

    return ret;
  }

  _prepareStringAsPayload(text) {
    return '"' + ("" + text).replace(/"/g, '\\"') + '"';
  }

  _encodeQueryParams(params) {
    return _.map(params, (value, key) => {
      return key + '=' + value;
    }).join('&');
  }

}
