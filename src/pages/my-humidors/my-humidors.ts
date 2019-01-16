import { Component } from '@angular/core';
import { LayoutController } from '../../shared/services/layout.controller';
import { HumidorModel } from '../../shared/models/humidor.model';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { SettingsModel } from '../../shared/models/settings.model';
import { MyHumidorsService } from '../../shared/services/my-humidors.service';
import * as _ from 'lodash';


@Component({
  selector: 'my-humidors',
  templateUrl: 'my-humidors.html'
})

export class MyHumidorsPage {

  private humidors: HumidorModel[];
  private settings: SettingsModel;
  private contentWrapperElement = <HTMLElement>document.querySelector('ion-col.content-wrapper');

  constructor(private route: ActivatedRoute,
              private router: RouterService,
              private myHumidorsService: MyHumidorsService,
              private layoutCtrl: LayoutController) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.humidors = data['humidors'][0];
      this.settings = data['humidors'][1];
      this.layoutCtrl.configure({
        'pageTitle': 'My Humidors',
        'showMenuLink': true,
        'showBackLink': false,
        'showHeader': true,
        'showFooter': true
      });
    });

    if (this.contentWrapperElement) {
      this.contentWrapperElement.style.overflow = 'hidden';
    }
  }

  humidorsTotalPrice() {
    return _.sumBy(this.humidors, (humidor: HumidorModel) => +humidor.totalPrice()).toFixed(2);
  }

  humidorsTotalCigars() {
    const total = _.sumBy(this.humidors, (humidor: HumidorModel) => +humidor.getTotalNumberOfCigars());
    return `${total} ${ total == 1 ? 'Cigar' : 'Cigars' }`;
  }

  edit(event, humidor) {
    event.stopPropagation();
    this.router.navigateByUrl('/my-humidors/' + (humidor.Id || humidor._Id) + '/edit');
  }

  displayTempValue(value) {
    if (!value) return;
    if (this.settings.TemperatureUnit == 'F') {
      return this.myHumidorsService.convertTempToF(value)
    } else {
      return Math.round(value)
    }
  }

  navigateTo(humidor) {
    event.stopPropagation();
    if (humidor.SensorDeviceId) {
      this.router.navigateByUrl(`/my-humidors/measurement-history/${(humidor.Id || humidor._Id)}`);
    } else {
      this.router.navigateByUrl('/my-humidors/coming-soon');
    }
  }

  ngOnDestroy() {
    if (this.contentWrapperElement) {
      this.contentWrapperElement.style.overflow = null;
    }
  }
}
