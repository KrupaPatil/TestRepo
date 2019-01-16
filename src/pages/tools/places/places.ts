import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

import { extractErrorMsg } from '../../../app/app.common';
import { PlaceModel } from '../../../shared/models/place.model';
import { PlaceResource } from '../../../shared/resources/place.resource';
import { LayoutController } from '../../../shared/services/layout.controller';
import { RouterService } from '../../../shared/services/router.service';

const DEFAULT_ZOOM = 11;

@Component({
  selector: 'places',
  templateUrl: 'places.html'
})
export class PlacesPage {

  private places: [PlaceModel];
  private viewType: string = 'map';
  private longitude;
  private latitude;
  private zoom = DEFAULT_ZOOM;
  private initCoords;
  private style;
  private eventCoords;
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController,
              private placeResource: PlaceResource,
              private router: RouterService,
              private alertCtrl: AlertController,
              private geolocation: Geolocation) {
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        this.initCoords = {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
        };

        this.loadPlaces({latitude: this.latitude, longitude: this.longitude});
      });

    this.layoutCtrl.configure({
      'pageTitle': 'Places',
      'showBackLink': true
    });

    this.style = [
      {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
      }, {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [{"saturation": "-100"}, {"gamma": 2}]
      }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{"saturation": "-100"}, {"gamma": "1.5"}]
      }, {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{"hue": "#ff4400"}, {"saturation": "-32"}, {"gamma": ".85"}]
      }, {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [{"hue": "#ff4d00"}, {"visibility": "simplified"}, {"lightness": -23}, {"gamma": 0.9}, {"saturation": 27}]
      }, {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [{"lightness": -5}, {"saturation": -100}]
      }, {"featureType": "transit", "elementType": "all", "stylers": [{"saturation": -100}]}, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"hue": "#003bff"}, {"gamma": 1.45}]
      }];

    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }
  }

  idle(event) {
    if (this.eventCoords) {
      this.loadPlaces(this.eventCoords);
    }
  }

  centerChanged(event) {
    if (!this.eventCoords) {
      this.eventCoords = {} as any;
    }

    this.eventCoords.latitude = event.lat;
    this.eventCoords.longitude = event.lng;
  }

  zoomChanged(zoom) {
    this.zoom = zoom;
  }

  loadPlaces(coords) {
    this.placeResource.getList(coords)
      .subscribe(
        (places: [PlaceModel]) => {
          this.places = places;
        },
        (err) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  openPlaceDetails(place: PlaceModel) {
    this.router.navigateWithParams(['/tools/places/' + place.venue.id], {
      Id: place.venue.id,
      Place: place
    });
  }

  reload() {
    this.loadPlaces({latitude: this.latitude, longitude: this.longitude});
  }

  refresh() {
    this.latitude = this.initCoords.latitude;
    this.longitude = this.initCoords.longitude;
    this.zoom = DEFAULT_ZOOM;
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = null;
    }
  }
}
