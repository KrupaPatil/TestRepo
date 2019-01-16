import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONFIG_GOOGLE_MAPS_KEY } from '@app/env';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class LocationService {

  constructor(private http: Http,
              private geolocation: Geolocation) {
  }

  getCurrentLocation() {
    return new Observable((o: Observer<any>) => {
      this.geolocation.getCurrentPosition({'timeout': 8000})
        .then((resp) => {
            o.next({
              latitude: resp.coords.latitude,
              longitude: resp.coords.longitude
            });
            o.complete();
          },
          err => {
            o.error(err);
          });
    });
  }

  getAddress(lat, long) {
    return new Observable((o: Observer<any>) => {
      this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&language=en&key=' + CONFIG_GOOGLE_MAPS_KEY)
        .subscribe(
          res => {
            const place = res.json().results ? res.json().results[0] : null;
            if (place && place['formatted_address']) {
              if (place.address_components.length < 2) {
                o.next(place['formatted_address']);
              } else {
                let customAddress = '';
                for (let i = 1; i < place.address_components.length; i++) {
                  let component = place.address_components[i];
                  if (component.types[0] == 'locality' ||
                    component.types[0] == 'administrative_area_level_1' ||
                    component.types[0] == 'country') {
                    customAddress = customAddress + place.address_components[i].long_name + ', ';
                  }
                }
                if (customAddress.charAt(customAddress.length - 1) == ' ') {
                  customAddress = customAddress.substr(0, customAddress.length - 2);
                }

                o.next(customAddress);
              }
              o.complete();
            } else {
              o.error({json: () => ({Message: 'Address not found.'})});
            }
          },
          err => {
            o.error(err);
          }
        );
    });
  }

  getImageLocationAddress(image) {
    return new Observable((o: Observer<any>) => {
      this.getImageLocationCoordinates(image)
        .subscribe(
          location => {
            this.getAddress(location['latitude'], location['longitude'])
              .subscribe(
                address => {
                  o.next(address);
                  o.complete();
                },
                () => {
                  o.next('');
                  o.complete();
                }
              );
          },
          () => {
            o.next('');
            o.complete();
          }
        );
    });
  }

  getImageLocationCoordinates(image) {
    return new Observable((o: Observer<any>) => {
      if (image.location) {
        o.next(image.location);
        o.complete();
      } else {
        this.getCurrentLocation()
          .subscribe(
            location => {
              o.next(location);
              o.complete();
            },
            (err) => {
              o.error(err);
            }
          );
      }
    });
  }

  getLocationAddress() {
    return new Observable((o: Observer<any>) => {
      this.getCurrentLocation()
        .subscribe(
          location => {
            this.getAddress(location['latitude'], location['longitude'])
              .subscribe(
                address => {
                  o.next(address);
                  o.complete();
                },
                () => {
                  o.next('');
                  o.complete();
                }
              );
          },
          (err) => {
            o.error(err);
          }
        );
    });
  }
}
