import {Component} from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';
import {AccountService} from '../../../shared/services/account.service';
import {RouterService} from '../../../shared/services/router.service';
import {LayoutController} from '../../../shared/services/layout.controller';
import { extractErrorMsg } from "../../../app/app.common";

@Component({
  selector: 'forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  private userEmail: string;

  constructor(private accountService: AccountService,
              private alertCtrl: AlertController,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private router: RouterService) {
  }

  ngOnInit() {
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
      this.accountService.forgotPassword(this.userEmail)
        .subscribe(
          () => {
            loading.dismiss();
            return this.router.navigateWithParams(['login'], {
              email: this.userEmail,
              message: 'Please check your email'
            });
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
    } else {
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
