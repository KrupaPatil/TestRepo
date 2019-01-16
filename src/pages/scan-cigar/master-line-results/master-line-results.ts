import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LayoutController } from '../../../shared/services/layout.controller';
import { ScanLogModel } from '../../../shared/models/scan-log.model';
import { RouterService } from '../../../shared/services/router.service';
import { createTemporaryId, extractErrorMsg } from '../../../app/app.common';
import { AlertController, LoadingController } from 'ionic-angular';
import { JournalData } from '../../../shared/data/journal.data';
import { LocationService } from '../../../shared/services/location.service';
import { CameraService } from '../../../shared/services/camera.service';
import { PictureModel } from '../../../shared/models/picture.model';
import { HumidorModel } from '../../../shared/models/humidor.model';
import { MyHumidorsService } from '../../../shared/services/my-humidors.service';
import { JOURNAL_LIST } from '../../../shared/models/journal-item.model';
import { ProductModel } from '../../../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'master-line-results',
  templateUrl: 'master-line-results.html'
})
export class MasterLineResultsPage {

  private scanLog: ScanLogModel;
  private image: PictureModel;
  private cigarAdded: boolean = false;
  private humidor: HumidorModel;
  private lines: [ProductModel];

  constructor(private layoutCtrl: LayoutController,
              private location: Location,
              private router: RouterService,
              private journalData: JournalData,
              private alertCtrl: AlertController,
              private locationService: LocationService,
              private cameraService: CameraService,
              private myHumidorsService: MyHumidorsService,
              private loadingCtrl: LoadingController,
              private route: ActivatedRoute) {
    this.scanLog = this.router.getParam('scanLog');
    this.image = this.cameraService.getLatest();
    this.humidor = this.router.getParam('humidor');

    this.route.data.subscribe(data => {
      this.lines = data['lines'];
    });

    if (!this.scanLog) {
      this.router.navigateToRoot();
    }
  }

  ngOnInit() {
    this._mapRelatedLinesToModels();

    this.layoutCtrl.configure({
      'pageTitle': 'Choose Product',
      'showMenuLink': false,
      'showHeader': true,
      'showFooter': true,
      'showBackLink': false,
      'manualBackButton': false,
      'backToJournal': true
    });
  }

  backButton() {
    this.location.back();
  }

  addCigarToHumidor(product) {
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

  addCigarToJournal(product) {
    if (this.cigarAdded) {
      this.router.navigate(['/scan-cigar/master-line' + product.getDetailsUrl()]);
      return;
    }
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    let data = {
      Product: product,
      List: JOURNAL_LIST,
      UserImageUrl: this.scanLog.originalImageUrl,
    };

    createTemporaryId(data);

    this.locationService.getImageLocationAddress(this.image)
      .subscribe(
        address => {
          data['Location'] = address;

          this.journalData.create(data).subscribe(
            (item) => {
              this._waitForApiCallAndNavigateTo(item, loading);
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
        });
  }

  private _waitForApiCallAndNavigateTo(item, loading) {
    if (item.Id) {
      loading.dismiss();
      this.cigarAdded = true;
      this.router.navigateWithParams(['scan-cigar/master-line/' + item.List + '/' + item.Id], {
        recordId: this.scanLog.logId
      });
    } else {
      setTimeout(() => {
        this._waitForApiCallAndNavigateTo(item, loading);
      }, 500);
    }
  }

  private _mapRelatedLinesToModels() {
    this.scanLog.data.RelatedLines = this.scanLog.data.RelatedLines.map(line => {
      if (line instanceof ProductModel) {
        return line;
      } else {
        if (line['Id']) {
          line['LineId'] = line['Id'];
          delete line['Id'];
        }
        return new ProductModel(line);
      }
    });
  }

  ngOnDestroy() {
    this.layoutCtrl.configure({
      'backToJournal': false
    });
  }
}
