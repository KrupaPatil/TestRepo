import {ActivatedRoute, Params} from '@angular/router';
import {Component} from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';
import {AccountService} from '../../../shared/services/account.service';
import {RouterService} from '../../../shared/services/router.service';
import {LayoutController} from '../../../shared/services/layout.controller';
import {ResetPasswordModel} from "../../../shared/models/reset-password.model";
import { extractErrorMsg } from "../../../app/app.common";

@Component({
  selector: 'reset-password',
  templateUrl: 'reset-password.html'
})

export class ResetPasswordPage {

  private userData: ResetPasswordModel = new ResetPasswordModel({});
  private key: string;
  private token: string;

  constructor(private accountService: AccountService,
              private alertCtrl: AlertController,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private router: RouterService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.key = params['key'];
      this.token = params['token'];

      if (!this.key || !this.token) {
        return this.router.navigateToRoot();
      }
    });

    this.layoutCtrl.configure({
      'showHeader': false,
      'showFooter': false
    });
  }

  submit(valid) {
    if (valid) {
      let loading = this.loadingCtrl.create({
        content: 'Loading...'
      });
      loading.present();
      this.userData.Key = this.key;
      this.userData.Token = this.token;
      this.accountService.resetPassword(this.userData)
        .subscribe(
          () => {
            loading.dismiss();
            this.router.navigateByUrl('login');
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

    else {
      let alert = this.alertCtrl.create({
        title: 'Error occurred',
        subTitle: 'You have errors to correct',
        buttons: ['OK']
      });
      alert.present();
      return;
    }
  }

}
