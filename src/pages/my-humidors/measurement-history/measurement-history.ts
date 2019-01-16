import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { extractErrorMsg } from '../../../app/app.common';
import { LayoutController } from '../../../shared/services/layout.controller';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';

import { Chart } from 'chart.js';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'measurement-history',
  templateUrl: 'measurement-history.html'
})

export class MeasurementHistory {
  @ViewChild('lineCanvas') lineCanvas;
  barChart: any;
  tempMeasurements = [];
  humidityMeasurements = [];
  selectedChart = 'humidity';
  tempUnit: string;
  humidorId: string;
  dateFrom: string;
  dateTo: string;
  today: string;
  dateFromLimit: string;
  private humidorListElement = <HTMLElement>document.querySelector('.humidor-outer-wrapper');
  private totalInfoElement = <HTMLElement>document.querySelector('.total-info');

  constructor(private route: ActivatedRoute,
              private alertCtrl: AlertController,
              private myHumidorService: MyHumidorsService,
              private layoutCtrl: LayoutController) {

    this.layoutCtrl.configure({
      'pageTitle': 'Measurement History',
      'showMenuLink': false,
      'showBackLink': true
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.humidorId = params['HumidorId'];
    });

    this.route.data.subscribe((data: any) => {
      this.today = moment().format();
      this.dateTo = this.today;
      this.dateFrom = moment().startOf('day').subtract(1, 'days').format();
      this.dateFromLimit = moment().startOf('day').subtract(30, 'days').format();
      this.tempUnit = data.measurements.Humidor.TemperatureUnit;
      this.setData(data.measurements.Measurements);
    });

    let timeFormat = 'YY/MM/DD HH:MM';
    this.barChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Humidity data',
          fill: false,
          lineTension: 0.2,
          pointHoverRadius: 7,
          pointBorderWidth: 5,
          pointHitRadius: 10,
          borderColor: "rgba(75,192,192,1)",
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(75,192,192,1)",
          data: this.humidityMeasurements
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            type: "time",
            time: {
              parser: timeFormat,
              tooltipFormat: 'YYYY/MM/DD HH:MM',
              unit: 'day'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '%'
            }
          }]
        }
      }
    });

    this.humidorListElement.style.display = 'none';
    this.totalInfoElement.style.display = 'none';
  }

  setData(data) {
    this.today = moment().format();
    this.tempMeasurements = [];
    this.humidityMeasurements = [];
    if (!data.length) return;

    _.forEach(data, (value) => {
      let tempObj = {
        'x': moment.utc(value.Date).local().format('YY/MM/DD HH:MM'),
        'y': this.temperatureUnitConversion(value.Temperature)
      };
      let humidityObj = {
        'x': moment.utc(value.Date).local().format('YY/MM/DD HH:MM'),
        'y': value.Humidity
      };

      this.tempMeasurements.push(tempObj);
      this.humidityMeasurements.push(humidityObj);
    });
  }

  showHumidityGraph() {
    this.selectedChart = 'humidity';
    this.barChart.data.datasets[0] = {
      label: 'Humidity data',
      fill: false,
      lineTension: 0.2,
      pointHoverRadius: 7,
      pointBorderWidth: 5,
      pointHitRadius: 10,
      borderColor: "rgba(75,192,192,1)",
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(75,192,192,1)",
      data: this.humidityMeasurements,
    };

    this.barChart.options.scales.yAxes[0] = {
      scaleLabel: {
        display: true,
        labelString: '%'
      }
    };

    this.barChart.update();
  }

  showTemperatureGraph() {
    this.selectedChart = 'temp';
    this.barChart.data.datasets[0] = {
      label: 'Temperature data',
      fill: false,
      lineTension: 0.2,
      pointHoverRadius: 7,
      pointBorderWidth: 5,
      pointHitRadius: 10,
      borderColor: "#dd423e",
      pointHoverBackgroundColor: "#dd423e",
      pointHoverBorderColor: "#dd423e",
      data: this.tempMeasurements,
    };

    this.barChart.options.scales.yAxes[0] = {
      scaleLabel: {
        display: true,
        labelString: this.tempUnit
      }
    };

    this.barChart.update();
  }

  temperatureUnitConversion(value) {
    if (this.tempUnit == 'F') {
      return Math.round(value * 9 / 5 + 32);
    } else {
      return value
    }
  }

  filterResults() {
    let dateFrom = moment(this.dateFrom).format('YYYY-MM-DD HH:mm:ss');
    let dateTo = moment(this.dateTo).format('YYYY-MM-DD HH:mm:ss');

    this.myHumidorService.getMeasurements(this.humidorId, dateFrom, dateTo).subscribe(
      (results) => {
        this.setData(results.Measurements);
        if (this.selectedChart == 'humidity') {
          this.showHumidityGraph();
        } else {
          this.showTemperatureGraph();
        }
      },
      (res) => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(res),
          buttons: ['OK']
        });
        alert.present();
      }
    )
  }

  ngOnDestroy() {
    this.humidorListElement.style.display = null;
    this.totalInfoElement.style.display = null;
    this.layoutCtrl.configure({
      'pageTitle': 'My Humidors',
      'showMenuLink': true,
      'showBackLink': false,
    });
  }
}
