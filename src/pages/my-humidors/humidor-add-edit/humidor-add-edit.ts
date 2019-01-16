import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from '../../../shared/services/layout.controller';
import { HumidorModel } from '../../../shared/models/humidor.model';
import { AlertController, LoadingController } from 'ionic-angular';
import { RouterService } from '../../../shared/services/router.service';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { createTemporaryId, extractErrorMsg } from '../../../app/app.common';
import * as _ from 'lodash';

@Component({
  selector: 'humidor-add-edit',
  templateUrl: './humidor-add-edit.html'
})
export class HumidorAddEdit {
  private humidor: HumidorModel = new HumidorModel({Name: '', Cigars: []});
  private _originalHumidor: HumidorModel;
  private humidorCopy: HumidorModel;
  private edit: boolean = false;
  private sensorId = '';
  private humidorListElement = <HTMLElement>document.querySelector('.humidor-outer-wrapper');
  private totalInfoElement = <HTMLElement>document.querySelector('.total-info');


  constructor(private route: ActivatedRoute,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private router: RouterService,
              private myHumidorsService: MyHumidorsService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['humidor']) {
        this.humidor = data['humidor'];
        this._originalHumidor = _.cloneDeep(this.humidor);
        this.edit = true;
      }
      this.layoutCtrl.configure({
        'pageTitle': this.humidor.Name,
        'showBackLink': true
      });
    });
    this.humidorListElement.style.display = 'none';
    this.totalInfoElement.style.display = 'none';

    if(this.myHumidorsService.selectedTempUnit) {
      this.humidor.TemperatureUnit = this.myHumidorsService.selectedTempUnit;
    }

    if (this.humidor.TemperatureUnit == 'F') {
      this.humidor.NotifyOnTemperatureUnder = this.myHumidorsService.convertTempToF(this.humidor.NotifyOnTemperatureUnder);
      this.humidor.NotifyOnTemperatureOver = this.myHumidorsService.convertTempToF(this.humidor.NotifyOnTemperatureOver);
    }
  }

  submit(form) {
    if (!form.valid) {
      let alert = this.alertCtrl.create({
        title: 'Error occurred',
        subTitle: 'You have errors to correct',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    if (!this.edit) {
      createTemporaryId(this.humidor);
    }

    if (!this.humidor.SensorDeviceId) {
      this.humidor.Temperature = null;
      this.humidor.Humidity = null;
      this.humidor.SensorBatteryLevel = null;
      this.humidor.ValuesRepeatedDate = null;
    }

    this.humidorCopy = _.cloneDeep(this.humidor);

    if (this.humidor.NotifyOnTemperatureUnder && this.humidor.TemperatureUnit == 'F') {
      this.humidorCopy.NotifyOnTemperatureUnder = this.myHumidorsService.convertTempToC(this.humidor.NotifyOnTemperatureUnder);
    }

    if (this.humidor.NotifyOnTemperatureOver && this.humidor.TemperatureUnit == 'F') {
      this.humidorCopy.NotifyOnTemperatureOver = this.myHumidorsService.convertTempToC(this.humidor.NotifyOnTemperatureOver);
    }

    let obs = this.edit ?
      this.myHumidorsService.update(this.humidorCopy) :
      this.myHumidorsService.create(this.humidorCopy);

    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    obs
      .subscribe(
        () => {
          loading.dismiss();
          this.router.navigate(['/my-humidors']);
        },
        (res) => {
          loading.dismiss();
          let errorMessage = extractErrorMsg(res);

          if (errorMessage == 'This Sensor is already associated with another Humidor') {
            let alert = this.alertCtrl.create({
              message: 'This sensor is already paired with another humidor. Click Transfer to move this sensor to this new humidor or Cancel',
              buttons: [
                {
                  text: 'CANCEL',
                  handler: () => { }
                },
                {
                  text: 'TRANSFER',
                  handler: () => {
                    let loading = this.loadingCtrl.create({
                      content: 'Loading...'
                    });
                    loading.present();
                    this.myHumidorsService.update(this.humidor, true).subscribe(
                      () => {
                        loading.dismiss();
                        this.router.navigate(['/my-humidors']);
                      },
                      (res) => {
                        let alert = this.alertCtrl.create({
                          title: 'Error occurred',
                          subTitle: extractErrorMsg(res),
                          buttons: ['OK']
                        });
                        alert.present();
                      });
                  }
                }
              ]
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: errorMessage,
              buttons: ['OK']
            });
            alert.present();
          }

        }
      );
  }

  deleteHumidor() {
    let alert = this.alertCtrl.create({
      title: 'Delete humidor',
      message: 'Are you sure you want to delete this humidor?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this._handleHumidorDelete();
          }
        }
      ]
    });

    alert.present();
  }

  cancel() {
    if (this.edit) {
      _.assignIn(this.humidor, this._originalHumidor);
    }
    this.router.navigate(['/my-humidors']);
  }

  onValueChange(model) {
    let helper = parseInt(this.humidor[model]);
    if (helper > 100) {
      helper = 100;
    } else if (helper <= 0) {
      helper = 1;
    } else {
      return helper;
    }

    setTimeout(() => {
      this.humidor[model] = helper;
      console.log(model);
    })
  }

  private _handleHumidorDelete() {
    this.myHumidorsService.deleteHumidor(this.humidor)
      .subscribe(
        () => {
          this.router.navigate(['/my-humidors']);
        },
        (res) => {
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  ngOnDestroy() {
    this.humidorListElement.style.display = null;
    this.totalInfoElement.style.display = null;
  }
}
