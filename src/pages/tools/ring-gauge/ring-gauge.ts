import { Component } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';

@Component({
  selector: 'ring-gauge',
  templateUrl: 'ring-gauge.html'
})
export class RingGaugePage {

  calibrationValue: number = null;
  private obj = {
    range: 45,
    dpr: window.devicePixelRatio,
    dpi: null,
    inches: null,
    userCalibratedRange: null,
  };

  private iosPpiBasedOnHeight = {
    "2732": 265,
    "2688": 458,
    "2436": 458,
    "2048": 264,
    "1920": 401,
    "1792": 326,
    "1334": 326,
    "1136": 326,
    "960": 326,
    "480": 163
  };

  private circle;
  private toolsMenuWrapper = <HTMLElement>document.querySelector('.tools-menu-wrapper');

  constructor(private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Ring Gauge Tool',
      'showBackLink': true
    });

    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = 'none';
    }
  }

  ngAfterViewInit() {
    this.circle = document.getElementById('circle');

    if (this.obj.dpr == 1) {
      this.obj.dpi = 96;
    } else {
      this.obj.dpi = 48 * this.obj.dpr;
    }

    let localStorageCalibration = parseInt(window.localStorage.getItem('RingGaugeCalibration'));
    if (localStorageCalibration) {
      this.obj.dpi = localStorageCalibration;
    }

    if (window['plugins'] && !localStorageCalibration) {
      window['plugins']['screensize'].get(
        (res) => {
          if (res.ydpi && res.densityValue) {
            this.obj.dpi = res.ydpi / res.densityValue;
          }
          else if (this.iosPpiBasedOnHeight[res.height] && res.scale) {
            this.obj.dpi = this.iosPpiBasedOnHeight[res.height] / res.scale;
          }
        },
        (err) => {
        }
      )
    }

    this.onChange();
  }

  onValueChange() {
    if (this.obj.userCalibratedRange > 90) {
      setTimeout(()=> {
        this.obj.userCalibratedRange = 90;
      })
    }
  }

  decrease() {
    if (this.obj.range > 30) {
      this.obj.range--;
      this.onChange();
    }
  }

  increase() {
    if (this.obj.range < 85) {
      this.obj.range++;
      this.onChange();
    }
  }

  onChange() {
    this.obj.inches = this.obj.range / 64;
    let newD = this.obj.inches * this.obj.dpi;
    this.circle.setAttribute('r', (newD - 2) / 2);
  };

  calibrate() {
    let newD = this.obj.range / 64 * this.obj.dpi;
    this.calibrationValue = (newD * 64) / this.obj.userCalibratedRange;
    this.obj.dpi = this.calibrationValue;
    this.obj.range = this.obj.userCalibratedRange;
    window.localStorage.setItem('RingGaugeCalibration', this.calibrationValue.toString());
  }

  ngOnDestroy() {
    if (window.innerWidth < 1200) {
      this.toolsMenuWrapper.style.display = null;
    }
  }
}
