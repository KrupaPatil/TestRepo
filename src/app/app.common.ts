import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';

declare var window: any;

export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = [];
  
  for(var i = 0; i < n; i++) {
    u8arr.push(bstr.charCodeAt(i));
  }
  
  return new Blob([new Uint8Array(u8arr)], {type:mime});
}

export function removeMethods(obj) {
  let props = [];

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop) && !_.isFunction(obj[prop])) {
      props.push(prop);
    }
  }

  return _.pick(obj, props);
}

export function renameKeys(data, keyMap) {
  return _.reduce(data, (newData, val, oldKey) => {
    let newKey = keyMap[oldKey] ? keyMap[oldKey] : oldKey;
    newData[newKey] = val;

    return newData;
  }, {});
}

export function createTemporaryId(obj) {
  obj['_Id'] = UUID.UUID();
}

export function matchByIdFn(data) {
  return (item) => {
    if (_.isObject(data)) {
      if (data.Id) {
        return item.Id == data.Id;
      } else if (item._Id) {
        return item._Id == data._Id;
      }
    } else {
      return item.Id == data || item._Id == data;
    }
  }
}

export function throwError(err: string) {
  // setTimeout is required when throwing error from observer
  setTimeout(() => {
    throw new Error(err);
  });
}


// used to handle various error responses
export function extractErrorMsg(err: any) {
  if (_.isObject(err)) {
    if (_.has(err, 'Message')) {
      return err.Message;
    }
    if (typeof err.json === 'function') {
      return extractErrorMsg(err.json());
    }
  } else if (typeof err == "string") {
    return err;
  }
  
  let tmp = _.isObject(err) ? JSON.stringify(err) : err;
  throwError(`Can't extract error message from ${tmp}`);
  
  return "Error occurred. Please try again later";
}

export function versionCompare(a, b) {
  if (a === b) {
    return 0;
  }

  if (a === null && b !== null) {
    return -1;
  }
  
  if (a !== null && b === null) {
    return 1;
  }
  
  if (a === null && b === null) {
    return 0;
  }
  
  var a_components = a.split(".");
  var b_components = b.split(".");
  
  var len = Math.min(a_components.length, b_components.length);
  
  // loop while the components are equal
  for (var i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1;
    }
    
    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1;
    }
  }
  
  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }
  
  if (a_components.length < b_components.length) {
    return -1;
  }
  
  // Otherwise they are the same.
  return 0;
}

export function mobileAndTabletCheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
