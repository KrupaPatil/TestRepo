import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController, ToastController } from 'ionic-angular';
import { extractErrorMsg, throwError } from '../../../app/app.common';
import { CameraService } from '../../../shared/services/camera.service';
import { CigarLogInfoService } from '../../../shared/services/cigar-log-info.service';
import { ImageSourceService } from '../../../shared/services/image-source.service';
import { SocialPostData } from '../../../shared/data/social-post.data';
import { LayoutController } from '../../../shared/services/layout.controller';
import { CustomPostModel } from '../../../shared/models/custom-post.model';

@Component({
  selector: 'custom-post',
  templateUrl: 'custom-post.html'
})

export class CustomPost {
  private customPost: CustomPostModel;

  constructor(private cameraService: CameraService,
              private socialPostData: SocialPostData,
              private layoutCtrl: LayoutController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private location: Location,
              private imageSourceService: ImageSourceService,
              private cigarInfoService: CigarLogInfoService) {
  }

  ngOnInit() {
    this.customPost = {
      cigarLocation: '',
      cigarTitle: '',
      cigarText: '',
      userImageUrl: ''
    }

    this.layoutCtrl.configure({
      'pageTitle': 'Create Custom Post',
      'showMenuLink': false,
      'showBackLink': true,
      'showCreateSocialPostButton': false
    });
  }

  takePicture() {
    this.cameraService.takePicture()
      .subscribe(
        (res: any) => {
          let data = this.cameraService.imageToFormData(res.data);
          this.cigarInfoService.getImageUrl(data).subscribe(
            (imageUrl) => {
              this.customPost.userImageUrl = imageUrl;
            },
            (res) => {
              console.log(JSON.stringify(res));
            }
          )
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

  setBackgroundImageUrl() {
    return 'url(' + this.imageSourceService.createSrc(this.customPost.userImageUrl) + ')';
  }

  setBackgroundImageHeight() {
    if (!this.customPost.userImageUrl) return '';
    if (window.innerWidth > 1200) {
      return '300px'
    } else {
      return '200px'
    }
  }

  submit(form) {
    if (form.invalid) return;
    this.socialPostData.createPost(
      null,
      null,
      this.customPost.cigarTitle,
      this.customPost.cigarText,
      this.customPost.userImageUrl,
      this.customPost.cigarLocation).subscribe(
      res => {
        let toast = this.toastCtrl.create({
          message: 'You have posted on social feed',
          duration: 2000,
          position: 'top',
        });
        toast.present();
        this.location.back();
      },
      err => {
        let alert = this.alertCtrl.create({
          title: 'Error occurred',
          subTitle: extractErrorMsg(err),
          buttons: ['OK']
        });
        alert.present();
      }
    )
  }
}

