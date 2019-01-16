import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { extractErrorMsg } from '../../app/app.common';
import { AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { SocialPostData } from '../data/social-post.data';

@Injectable()
export class SocialPostsResolver implements Resolve<any> {

  constructor(
    private socialPostData: SocialPostData,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    let params: any = route.params;
    this.socialPostData.setSelectedPosts(params.Id);
    loading.present();
    if (this.socialPostData.selectedPosts.length < 10) {
      loading.present();
      return this.socialPostData
        .getList(this.socialPostData.selectedPosts.length, 10, 2, params.Id)
        .map(value => {
          loading.dismiss();
          return value;
        })
        .catch((err) => {
          loading.dismiss();

          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: extractErrorMsg(err),
            buttons: ['OK']
          });
          alert.present();

          return Observable.throw(err);
        });
    }
    loading.dismiss();
    return this.socialPostData.selectedPosts;
  }
}
