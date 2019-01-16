import { Component, ViewChild } from '@angular/core';
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AccountService } from "../../shared/services/account.service";
import { LayoutController } from "../../shared/services/layout.controller";
import { ActiveUserService } from "../../shared/services/active-user.service";
import { UserModel } from "../../shared/models/user.model";
import { CameraService } from "../../shared/services/camera.service";
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import * as _ from 'lodash';
import { extractErrorMsg, throwError } from "../../app/app.common";

@Component({
  selector: 'my-profile',
  templateUrl: 'my-profile.html'
})
export class MyProfilePage {

  private originalUserData: UserModel;
  private userData;
  private changePassword: boolean = false;
  private showCropper = false;
  private imageSubmitted: boolean = false;

  data: any;
  cropperSettings: CropperSettings;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor(private accountService: AccountService,
              private activeUserService: ActiveUserService,
              private alertCtrl: AlertController,
              private cameraService: CameraService,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {

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
    this.userData = this.activeUserService.user();
    this.originalUserData = _.cloneDeep(this.userData);

    this.layoutCtrl.configure({
      'pageTitle': 'My Profile',
      'showMenuLink': false,
      'showBackLink': true,
      'showHeader': true,
      'showFooter': false
    });
  }

  ngOnDestroy() {
    if (this.imageSubmitted) {
      _.assignIn(this.userData, this.originalUserData);
    }
  }

  takePicture() {
    let image: any = new Image();
    this.cameraService.takePicture()
      .subscribe(
        (data: any) => {
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

    this.accountService.update(this.userData)
      .subscribe(
        () => {
          loading.dismiss();
          this.changePassword = false;

          let toast = this.toastCtrl.create({
            message: 'Profile updated successfully',
            duration: 3000,
            position: 'top'
          });

          _.assignIn(this.originalUserData, this.userData);

          toast.present();
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

  cancelAvatarChange() {
    this.showCropper = false;

  }

  submitImage() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.imageSubmitted = true;

    this.accountService.uploadProfilePicture(this.data.image)
      .subscribe(
        (url: string) => {
          this.accountService.changeProfilePicture(url)
            .subscribe(
              () => {
                loading.dismiss();

                let toast = this.toastCtrl.create({
                  message: 'Profile picture updated successfully',
                  duration: 3000,
                  position: 'top'
                });

                _.assignIn(this.originalUserData, this.userData);

                toast.present();
                this.showCropper = false;
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
      );
  }

}
