import { Component } from '@angular/core';
import { PlaceModel } from '../../../../shared/models/place.model';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from "../../../../shared/services/layout.controller";
import { Platform } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'place',
  templateUrl: 'place.html'
})
export class PlacePage {

  private place: PlaceModel;
  private style;
  private baseUrl: string;
  private sanitizedUrl;

  constructor(private layoutCtrl: LayoutController,
              private platform: Platform,
              private sanitizer:DomSanitizer,
              private route: ActivatedRoute) {
    this.place = this.route.snapshot.data['place'];
  }


  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': this.place.venue.name,
      'showBackLink': true
    });

    if (this.platform.is('ios')) {
      this.baseUrl = 'maps:?q=';
    } else if (this.platform.is('android') || this.platform.is('windows')) {
      this.baseUrl = 'geo:?q=';
    } else {
      this.baseUrl = 'http://maps.google.com/?q=';
    }

    let url = this.baseUrl + this.place.venue.location.address + this.place.venue.location.city + this.place.venue.location.country;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url);

    this.style = [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#444444"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f1f1f1"
          },
          {
            "saturation": "-100"
          },
          {
            "lightness": "-3"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          },
          {
            "saturation": "-100"
          },
          {
            "lightness": "40"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": "0"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "saturation": "35"
          },
          {
            "lightness": "1"
          },
          {
            "hue": "#ecb4a1"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#cfb6ac"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "on"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#becdff"
          }
        ]
      }
    ]
  }

}
