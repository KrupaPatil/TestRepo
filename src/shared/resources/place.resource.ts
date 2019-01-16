import { Injectable } from '@angular/core';
import { PlaceApiResource } from './api/place-api.resource';

@Injectable()
export class PlaceResource {

  constructor(private api: PlaceApiResource) {
  }

  public getList(coords) {
    return this.api.getList(coords);
  }

  public get(id) {
    return this.api.getPlace(id);
  }

}
