import { Component } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { extractErrorMsg } from '../../../app/app.common';
import { AccountService } from '../../../shared/services/account.service';
import { FacebookAuthService } from '../../../shared/services/auth/facebook-auth.service';
import { TwitterAuthService } from '../../../shared/services/auth/twitter-auth.service';
import { LayoutController } from '../../../shared/services/layout.controller';
import { MigrationService } from '../../../shared/services/migration.service';
import { RouterService } from '../../../shared/services/router.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private type = 'cigar-scanner';
  private email: string;
  private password: string;
  private mergeData: boolean = false;

  constructor(private accountService: AccountService,
              private alertCtrl: AlertController,
              private facebookAuthService: FacebookAuthService,
              private layoutCtrl: LayoutController,
              private loadingCtrl: LoadingController,
              private router: RouterService,
              private storageService: StorageService,
              private twitterAuthService: TwitterAuthService,
              private migrationService: MigrationService,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.email = this.router.getParam('email');
    const message = this.router.getParam('message');

    if (this.email && message) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });

      toast.present();
    }

    this.layoutCtrl.configure({
      'showHeader': false,
      'showFooter': false
    });

  }

  submit(isFb, isWebsiteAccount) {
    if (!this.storageService.hasGuestData()) {
      this.login(isFb, isWebsiteAccount);
      return;
    }

    let alert = this.alertCtrl.create({
      message: 'Do you want to add current data to your account?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.storageService.clear().subscribe(() => {
              this.login(isFb, isWebsiteAccount);
            });
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.mergeData = true;
            this.login(isFb, isWebsiteAccount);
          }
        }
      ]
    });
    alert.present();
  }

  login(isFb, isWebsiteAccount) {
    if (isFb) {
      this.facebook();
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();
    this.accountService.login(this.email, this.password, isWebsiteAccount, this.mergeData)
      .subscribe(
        () => {
          this.storageService.clear().subscribe(() => {
            loading.dismiss();
            this.router.navigateToRoot();
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
  }

  facebook() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.facebookAuthService.login(this.mergeData)
      .subscribe(
        () => {
          this.migrationService.migrateUserData()
            .subscribe(
              res => {
                this.storageService.clear().subscribe(() => {
                  loading.dismiss();
                  this.router.navigateToRoot();
                });
              },
              err => {
                this.router.navigateToRoot();
                loading.dismiss();
              }
            );
        },
        (res) => {
          loading.dismiss();

          if (res == 'User cancelled.') {
            return;
          }

          let alert = this.alertCtrl.create({
            title: 'Error occurred',
            subTitle: res,
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  twitter() {
    // TODO Ionic Cloud is depratected and this is not working anymore

    // let loading = this.loadingCtrl.create({
    //   content: 'Loading...'
    // });
    // loading.present();

    // this.twitterAuthService.login()
    //   .subscribe(
    //     () => {
    //       this.router.navigateToRoot();
    //       loading.dismiss();
    //     },
    //     (res) => {
    //       loading.dismiss();
    //       let alert = this.alertCtrl.create({
    //         title: 'Error occurred',
    //         subTitle: extractErrorMsg(res),
    //         buttons: ['OK']
    //       });
    //       alert.present();
    //     }
    //   );
  }
}
