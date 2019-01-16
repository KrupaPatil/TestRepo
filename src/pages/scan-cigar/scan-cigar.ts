import { Component } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { fabric } from 'fabric';
import { PictureModel } from "../../shared/models/picture.model";
import { ScanCigarService } from "../../shared/services/scan-cigar.service";
import { CameraService } from "../../shared/services/camera.service";
import { RouterService } from "../../shared/services/router.service";
import { LayoutController } from "../../shared/services/layout.controller";
import { ScanLogModel } from "../../shared/models/scan-log.model";
import { JournalData } from '../../shared/data/journal.data';
import { createTemporaryId, extractErrorMsg } from '../../app/app.common';
import { LocationService } from '../../shared/services/location.service';
import { HumidorModel } from '../../shared/models/humidor.model';
import { MyHumidorsService } from '../../shared/services/my-humidors.service';
import { JOURNAL_LIST } from '../../shared/models/journal-item.model';
import * as _ from 'lodash';
import { GoogleAnalyticsService } from "../../shared/services/google-analytics.service";

@Component({
  selector: 'scan-cigar',
  templateUrl: 'scan-cigar.html'
})
export class ScanCigarPage {

  private image: PictureModel;
  private editMode: boolean = false;
  private canvas;
  private outline;
  private showSplashScreen: boolean = false;
  private results;
  private canvasWidth;
  private canvasHeight;
  private defaultOverlaySize = 0.4;
  private humidor: HumidorModel;

  constructor(private alertCtrl: AlertController,
              private cameraService: CameraService,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private router: RouterService,
              private scanCigarService: ScanCigarService,
              private journalData: JournalData,
              private locationService: LocationService,
              private myHumidorsService: MyHumidorsService,
              private googleAnalyticsService: GoogleAnalyticsService) {
    this.image = this.cameraService.getLatest();
    this.humidor = this.router.getParam('humidor');
  }

  ngOnInit() {
    if (!this.image) {
      this.router.navigateToRoot();
    }

    this.layoutCtrl.configure({
      'showHeader': false,
      'showFooter': false
    });
  }

  ngAfterViewInit() {
    // timeout prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.image) {
        if (window.innerWidth > 1200) {
          this.canvasHeight = window.innerHeight - 150 + 'px';
          this.canvasWidth = this.image.width / this.image.height * (window.innerHeight - 150) + 'px';
        }
        else {
          this.canvasWidth = window.innerWidth + 'px';
          this.canvasHeight = this.image.height / this.image.width * window.innerWidth + 'px';
        }
        this._scanPicture();
      }
    }, 0);
  }


  private _scanPicture() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    // Set timeout is here to leave enough time for loader to show before image processing starts
    setTimeout(() => {
      this.scanCigarService.scanPicture(this.image.data)
        .subscribe(
          (coords) => {
            this.canvas = new fabric.Canvas('cigar-canvas', {
              uniScaleTransform: true
            });

            this.canvas.setBackgroundImage(
              this.image.data,
              () => {
                this._addOutline(coords);
                loading.dismiss();
              },
              {
                width: this.canvas.width,
                height: this.canvas.height,
                originX: 'left',
                originY: 'top'
              }
            );
          },
          (res) => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error occurred',
              subTitle: extractErrorMsg(res),
              buttons: ['OK']
            });
            alert.present();
            this.router.navigateToRoot();
          }
        );
    }, 300);
  }

  private _addOutline(coords) {
    if (coords.right - coords.left <= 0 || coords.bottom - coords.top <= 0) {
      coords = this._defaultOverlayCoords();
    }

    this.outline = new fabric.Rect({
      left: this._applyRatio(coords.left),
      top: this._applyRatio(coords.top),
      originX: 'left',
      originY: 'top',
      width: this._applyRatio(coords.width),
      height: this._applyRatio(coords.height),
      angle: coords.angle,
      fill: 'rgba(255, 184, 6, 0.25)',
      borderColor: '#FFB806',
      cornerColor: '#FFB806',
      cornerSize: 20,
      transparentCorners: false,
      selectable: true
    });

    this.canvas.add(this.outline);
    this.canvas.setActiveObject(this.outline);
  }

  private _applyRatio(val) {
    return (this.canvas.width / this.image.width) * val;
  }

  back() {
    this.router.navigateToRoot();
  }

  submit() {
    this.showSplashScreen = true;
    this.googleAnalyticsService.trackEvent('Cigar Scanning', 'Cigar Scanned');

    this.scanCigarService.submitPicture(
      this.image,
      this.outline.getAngle(),
      Math.floor(this.outline.getLeft() / (this.canvas.width / this.image.width)),
      Math.floor(this.outline.getTop() / (this.canvas.width / this.image.width)),
      Math.floor(this.outline.getWidth() / (this.canvas.width / this.image.width)),
      Math.floor(this.outline.getHeight() / (this.canvas.width / this.image.width))
    )
      .subscribe(
        (results: ScanLogModel) => {
          // no results
          if (!results.data) {
            this.googleAnalyticsService.trackEvent('Cigar Scanning', 'Cigar Not Found');
            this.router.navigateWithParams(['scan-cigar/no-results'], {scanLog: results});

          // product or single line recognised
          } else if (results.data.ProductId || !results.data.Attributes.MasterLine) {
            this.googleAnalyticsService.trackEvent('Cigar Scanning', 'Cigar Found');

            if (this.humidor) {
              // product
              if (results.data.ProductId) {
                this._addCigarToHumidor(results.data);

              // line
              } else {
                this.router.navigateWithParams(['scan-cigar/master-line'], {
                  scanLog: results,
                  humidor: this.humidor
                });
              }

            // product or line
            } else {
              this._addCigarToJournal(results.data, results.originalImageUrl, results.logId);
            }

          // master line recognised
          } else {
            this.googleAnalyticsService.trackEvent('Cigar Scanning', 'Master Line Found');

            this.router.navigateWithParams(['scan-cigar/master-line'], {
              scanLog: results,
              humidor: this.humidor
            });
          }
        },
        () => {
          this.showSplashScreen = false;
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: "Image recognition failed",
            buttons: ['OK']
          });
          alert.present();

          this.router.navigateToRoot();
        }
      );
  }

  enterEditMode() {
    this.editMode = true;
    this.outline.selectable = true;
    this.canvas.setActiveObject(this.outline);
    this.canvas.renderAll();
  }

  cancelEditMode() {
    this.editMode = false;
    this.outline.selectable = false;
    this.canvas.deactivateAll();
    this.canvas.renderAll();
  }

  _defaultOverlayCoords() {
    const height = this.image.height * this.defaultOverlaySize;
    const width = this.image.width * this.defaultOverlaySize;
    const verticalCenter = this.image.height / 2;
    const horizontalCenter = this.image.width / 2;

    return {
      angle: 0,
      top: verticalCenter - height / 2,
      bottom: verticalCenter + height / 2,
      left: horizontalCenter - width / 2,
      right: horizontalCenter + width / 2,
      width: width,
      height: height,
    };
  }

  private _addCigarToHumidor(product) {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.myHumidorsService.addCigar(this.humidor, product)
      .subscribe(
        res => {
          loading.dismiss();
          this.router.navigate(['/my-humidors/' + this.humidor.Id]);
        },
        err => {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  private _addCigarToJournal(product, imageUrl, recordId) {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    let data = {
      Product: product,
      List: JOURNAL_LIST,
      UserImageUrl: imageUrl,
      RecognitionId: recordId,
      Date: new Date().toISOString()
    };

    createTemporaryId(data);

    this.locationService.getImageLocationAddress(this.image)
      .subscribe(
        address => {
          data['Location'] = address;

          this.journalData.create(data).subscribe(
            (item) => {
              loading.dismiss();
              this.router.navigateWithParams([item.getDetailsUrl()],
                { recordId: recordId},
                { queryParams: { line: true } } );
            },
            err => {
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Error occurred',
                subTitle: extractErrorMsg(err),
                buttons: ['OK']
              });
              alert.present();
              this.router.navigate(['my-cigars']);
            }
          );
        }
    );
  }

}
