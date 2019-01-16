import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { SocialPostData } from '../data/social-post.data';

@Injectable()
export class ProductPostResolver implements Resolve<any> {
  constructor(private socialPostData: SocialPostData, private loadingCtrl: LoadingController) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Observable((o: Observer<any>) => {
      let loading = this.loadingCtrl.create({
        content: 'Loading...'
      });
      loading.present();
      return this.socialPostData.getMyDistinctList().subscribe(
        (result) => {
          loading.dismiss();
          o.next(result);
          return o.complete();
        },
        (err) => {
          return o.error(err);
        }
      );
    });
  }

}
