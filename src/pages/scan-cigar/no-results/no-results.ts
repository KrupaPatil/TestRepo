import { Component } from '@angular/core';
import { LayoutController } from '../../../shared/services/layout.controller';
import { ActivatedRoute } from '@angular/router';
import { ScanLogModel } from '../../../shared/models/scan-log.model';
import { DataSummaryModel } from '../../../shared/models/data-summary.model';
import { RouterService } from '../../../shared/services/router.service';
import { CameraService } from '../../../shared/services/camera.service';
import { JournalData } from '../../../shared/data/journal.data';
import { AlertController } from 'ionic-angular';
import { createTemporaryId, extractErrorMsg, throwError } from '../../../app/app.common';
import { Platform } from 'ionic-angular';
import { ManualRecognitionResource } from "../../../shared/resources/manual-recognition.resource";
import { ManualRecognitionModel } from "../../../shared/models/manual-recognition.model";
import { PushNotificationsService } from "../../../shared/services/push-notifications.service";

@Component({
  selector: 'no-results',
  templateUrl: 'no-results.html'
})
export class NoResultsPage {

  private scanLog: ScanLogModel;

  private manualEntryMode: boolean = false;
  private recognitionReceived: boolean = false;

  private name: string;
  private dataSummary: DataSummaryModel;
  private detectedPlatform = '';
  private imageData = {};

  constructor(private layoutCtrl: LayoutController,
              private router: RouterService,
              private activatedRoute: ActivatedRoute,
              private platform: Platform,
              private manualRecognitionResource: ManualRecognitionResource,
              private pushNotificationsService: PushNotificationsService,
              private cameraService: CameraService,
              private journalData: JournalData,
              private alertCtrl: AlertController) {
    this.scanLog = this.router.getParam('scanLog');
    this.dataSummary = this.activatedRoute.snapshot.data['dataSummary'];
    if (!this.scanLog) {
      this.router.navigateToRoot();
    }
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'pageTitle': 'Cigar Not Recognized',
      'showMenuLink': false,
      'showBackLink': true,
      'showHeader': true,
      'showFooter': true
    });

    if (this.platform.is('ios')) {
      this.detectedPlatform = 'iOS';
    } else if (this.platform.is('Android')) {
      this.detectedPlatform = 'Android';
    } else {
      this.detectedPlatform = 'Web';
    }
  }

  requestManualRecognition() {
    let imageOptions = new ManualRecognitionModel({
      LogId: this.scanLog.logId,
      ImageUrl: this.scanLog.originalImageUrl,
      Platform: this.detectedPlatform
    });

    this.manualRecognitionResource.requestManualRecognition(imageOptions).subscribe(
      res => {
        this.recognitionReceived = true;
        this.pushNotificationsService.askForPermission();
      },
      err => {
        if (err) {
          throwError(`Error calling manual recognition ${JSON.stringify(err)}`);
        }
      }
    )
  }

  manualEntry() {
    // this.layoutCtrl.configure({
    //   'pageTitle': 'Manual Entry'
    // });
    // this.manualEntryMode = true;
    this.router.navigate(['/cigar-search']);

  }

  submitManualEntry() {
    console.log('submitManualEntry', this.name);
  }

  backButton() {
    this.router.navigateToRoot();
  }

  takePicture() {
    this.cameraService.takePicture()
      .subscribe(
        () => {
          this.router.navigate(['/scan-cigar']);
        },
        (error) => {
          if (error) {
            throwError(`Error taking picture ${JSON.stringify(error)}`);
          }
        }
      );
  }

  onResultClick(product) {
    let data = {Product: product, UserImageUrl: this.scanLog.originalImageUrl};
    createTemporaryId(data);

    this.journalData.create(data).subscribe(
      () => {
        this.router.navigate(['my-cigars']);
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(err),
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

}

