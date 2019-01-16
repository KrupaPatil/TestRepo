import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { NetworkService } from '../../services/network.service';
import { PlaceModel } from './../../models/place.model';
import { BaseApiResource } from './base-api.resource';

@Injectable()
export class PlaceApiResource extends BaseApiResource {

  constructor(private http: Http,
              private networkService: NetworkService,
              private geolocation: Geolocation) {
    super();
  }

  public getList(coords) {
    return new Observable((o: Observer<PlaceModel[]>) => {
        return this._fetchPlaces(o, coords.latitude, coords.longitude);
    });
  }

  public getPlace(id) {
    return new Observable((o: Observer<PlaceModel>) => {
      this.geolocation.getCurrentPosition()
        .then((resp) => {
          return this._fetchPlace(o, id);
        })
        .catch((error) => {
          return o.error(error);
        });
    });
  }

  private _fetchPlaces(o: Observer<PlaceModel[]>, lat, long) {
    if (!this.networkService.isConnected()) {
      return this.networkService.notConnectedError().subscribe();
    }

    return this.http.get('https://api.foursquare.com/v2/venues/explore?client_id=IKUW4KKVYMWY11DPMGLONUOGC1H3UMWYUDNEFWYYDFAZIKUU&client_secret=SWOCNQ2VWBSPIJGSFVLDKRVOIFQR5LO2F1C4I3U51OGKKJD1&ll=' + lat + ',' + long + '&query=closest+smoke+shop&v=20130815&limit=15&categoryId=4bf58dd8d48988d123951735&venuePhotos=1&sortByDistance=1')
      .map(res => {
        let data = res.json();
        return this._mapCollection(PlaceModel, data.response.groups[0].items);
      })
      .subscribe(
        (results) => {
          o.next(results);
          return o.complete();
        },
        (error) => {
          return o.error(error);
        }
      );
  }

  private _fetchPlace(o: Observer<PlaceModel>, id) {
    return this.http.get('https://api.foursquare.com/v2/venues/' + id + '?client_id=IKUW4KKVYMWY11DPMGLONUOGC1H3UMWYUDNEFWYYDFAZIKUU&client_secret=SWOCNQ2VWBSPIJGSFVLDKRVOIFQR5LO2F1C4I3U51OGKKJD1&v=20130815&venuePhotos=1')
      .map(res => {
        let data = res.json();
        return new PlaceModel(data.response);
      })
      .subscribe(
        (results) => {
          o.next(results);
          return o.complete();
        },
        (error) => {
          return o.error(error);
        }
      );
  }

}
