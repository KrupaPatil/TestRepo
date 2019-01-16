import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController, ToastController } from 'ionic-angular';
import { ActivatedRoute } from '@angular/router';
import { LayoutController } from '../../../shared/services/layout.controller';
import { EmitterService } from '../../../shared/services/emitter.service';
import { SocialPostData } from '../../../shared/data/social-post.data';
import { extractErrorMsg } from '../../../app/app.common';

@Component({
  selector: 'product-post',
  templateUrl: 'product-post.html'
})
export class ProductPost {
  products;

  constructor(private layoutCtrl: LayoutController,
              private toastCtrl: ToastController,
              private location: Location,
              private socialPostData: SocialPostData,
              private emitterService: EmitterService,
              private activatedRoute: ActivatedRoute,
              private alertCtrl: AlertController) {
  }


  ngOnInit() {
    this.emitterService.socialDetailsScreen(false);
    this.activatedRoute.data.subscribe((data: any) => {
      this.products = data.products;
    });

    this.layoutCtrl.configure({
      'pageTitle': 'Share a product from your list',
      'showMenuLink': false,
      'showBackLink': true,
      'showCreateSocialPostButton': false
    });
  }

  createPost(cigar) {
    let {ProductId, LineId, Title, Text, ImageUrl, Location} = cigar;
    this.socialPostData.createPost(ProductId, LineId, Title, Text, ImageUrl, Location).subscribe(
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
      })
  }
}
