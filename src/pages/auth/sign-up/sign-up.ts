import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

import { extractErrorMsg, throwError } from '../../../app/app.common';
import { PictureModel } from '../../../shared/models/picture.model';
import { UserSignUpModel } from '../../../shared/models/user-sign-up.model';
import { AccountService } from '../../../shared/services/account.service';
import { CameraService } from '../../../shared/services/camera.service';
import { LayoutController } from '../../../shared/services/layout.controller';
import { MigrationService } from '../../../shared/services/migration.service';
import { RouterService } from '../../../shared/services/router.service';

@Component({
  selector: 'sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {

  private userData: UserSignUpModel = new UserSignUpModel({});
  private showCropper = false;

  data: any;
  cropperSettings: CropperSettings;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor(private accountService: AccountService,
              private alertCtrl: AlertController,
              private cameraService: CameraService,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private router: RouterService,
              private migrationService: MigrationService,
              private toastCtrl: ToastController) {

    let userData = this.router.getParam('userData');

    if (userData) {
      this.userData = userData;
    }

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 700;
    this.cropperSettings.canvasHeight = 400;

    if (window.innerWidth < 1200) {
      this.cropperSettings.canvasWidth = window.innerWidth;
      this.cropperSettings.canvasHeight = 300;
    }

    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;

    this.cropperSettings.rounded = false;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

    this.cropperSettings.noFileInput = true;
    this.data = {};
  }

  ngOnInit() {
    this.layoutCtrl.configure({
      'showHeader': false,
      'showFooter': false
    });
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

    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.accountService.signUp(this.userData)
      .subscribe(
        () => {
          this.router.navigateToRoot();
          loading.dismiss();
        },
        (res) => {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  changeProfilePicture() {
    let image: any = new Image();
    this.cameraService.takePicture()
      .subscribe(
        (data: PictureModel) => {
          let loading = this.loadingCtrl.create({
            content: 'Uploading picture...'
          });
          image.src = data.data;
          this.cropper.setImage(image);
          this.showCropper = true;
        },
        (error) => {
          if (error) {
            throwError(`Error taking picture ${JSON.stringify(error)}`);
          }
        }
      );
  }

  removeProfilePicture() {
    this.userData.AvatarUrl = '';
  }

  cancelAvatarChange() {
    this.showCropper = false;
  }

  submitImage() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.accountService.uploadProfilePicture(this.data.image)
      .subscribe(
        (url: string) => {
          loading.dismiss();

          let toast = this.toastCtrl.create({
            message: 'Profile picture updated successfully',
            duration: 3000,
            position: 'top'
          });
          toast.present();

          this.showCropper = false;

          this.userData.AvatarUrl = url;
        },
        (res) => {
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(res),
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

}
